import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { parseResumeFile, ParseFileResponse } from './api';

// Point the worker at the matching CDN URL for the installed version.
// This avoids bundling the worker (which can conflict with Vite) while
// guaranteeing the version always matches the installed pdfjs-dist.
if (typeof window !== 'undefined' && !(pdfjsLib as any).__workerConfigured) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  (pdfjsLib as any).__workerConfigured = true;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COMMON_SECTION_HEADINGS = [
  'summary', 'professional summary', 'objective', 'experience',
  'work experience', 'employment history', 'education', 'skills',
  'technical skills', 'projects', 'certifications', 'achievements',
  'awards', 'leadership', 'publications', 'volunteer',
  'extracurricular', 'languages', 'interests',
];

function cleanResumeText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function detectResumeSections(text: string): string[] {
  const found = new Set<string>();
  for (const line of text.split('\n')) {
    const t = line.trim().toLowerCase().replace(/[:\-_#*]/g, '').trim();
    if (t.length > 2 && t.length < 35) {
      for (const s of COMMON_SECTION_HEADINGS) {
        if (t === s || t.startsWith(s + ' ') || t.endsWith(' ' + s)) found.add(s);
      }
    }
  }
  return Array.from(found);
}

function buildResponse(text: string, fileType: string, originalFileName: string): ParseFileResponse {
  const cleanedText = cleanResumeText(text);
  if (!cleanedText || cleanedText.length < 30) {
    throw new Error(
      'This document appears to have insufficient or unreadable text. Please try a text-based document or paste your resume text directly.'
    );
  }
  return {
    text: cleanedText,
    wordCount: cleanedText.trim().split(/\s+/).filter(Boolean).length,
    charCount: cleanedText.length,
    detectedSections: detectResumeSections(cleanedText),
    fileType,
    originalFileName,
  };
}

// ─── PDF parsing via pdfjs-dist (runs entirely in the browser) ─────────────────

async function parsePdfInBrowser(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }

  await pdf.destroy();
  return fullText;
}

// ─── Main hybrid parser ────────────────────────────────────────────────────────

/**
 * Parses any uploaded resume document entirely in the browser:
 *  - TXT / MD  → FileReader.readAsText   (instant, no network)
 *  - DOCX      → mammoth                 (instant, no network)
 *  - PDF       → pdf.js                  (instant, no network)
 * Falls back to the server /api/parse-file if all browser methods fail.
 */
export async function parseFileHybrid(file: File): Promise<ParseFileResponse> {
  const lowerName = file.name.toLowerCase();
  const mime = file.type || '';

  // 1. Plain text / markdown
  if (mime.startsWith('text/') || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
    const text = await file.text();
    return buildResponse(text, 'txt', file.name);
  }

  // 2. DOCX / DOC via mammoth
  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mime === 'application/msword' ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 30) {
        return buildResponse(result.value, 'docx', file.name);
      }
    } catch (err) {
      console.warn('mammoth DOCX parse failed, trying server:', err);
    }
  }

  // 3. PDF via pdfjs-dist (runs in browser, no server call needed)
  if (mime === 'application/pdf' || lowerName.endsWith('.pdf')) {
    try {
      const pdfText = await parsePdfInBrowser(file);
      if (pdfText && pdfText.trim().length > 30) {
        return buildResponse(pdfText, 'pdf', file.name);
      }
      throw new Error('PDF text extraction returned empty content.');
    } catch (err) {
      console.warn('Browser PDF parse failed, trying server fallback:', err);
    }
  }

  // 4. Server fallback — only reached if browser parsing above fails
  return parseResumeFile(file);
}
