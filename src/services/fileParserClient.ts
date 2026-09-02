import mammoth from 'mammoth';
import { parseResumeFile, ParseFileResponse } from './api';

const COMMON_SECTION_HEADINGS = [
  'summary',
  'professional summary',
  'objective',
  'experience',
  'work experience',
  'employment history',
  'education',
  'skills',
  'technical skills',
  'projects',
  'certifications',
  'achievements',
  'awards',
  'leadership',
  'publications',
  'volunteer',
  'extracurricular',
  'languages',
  'interests',
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
  const lines = text.split('\n');
  const found = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase().replace(/[:\-_#*]/g, '').trim();
    if (trimmed.length > 2 && trimmed.length < 35) {
      for (const section of COMMON_SECTION_HEADINGS) {
        if (trimmed === section || trimmed.startsWith(section + ' ') || trimmed.endsWith(' ' + section)) {
          found.add(section);
        }
      }
    }
  }

  return Array.from(found);
}

function buildParsedResponse(text: string, fileType: string, originalFileName: string): ParseFileResponse {
  const cleanedText = cleanResumeText(text);
  if (!cleanedText || cleanedText.length < 30) {
    throw new Error('Insufficient or unreadable text found in the document. Please try a text-based document.');
  }

  const words = cleanedText.trim().split(/\s+/).filter(Boolean);
  const detectedSections = detectResumeSections(cleanedText);

  return {
    text: cleanedText,
    wordCount: words.length,
    charCount: cleanedText.length,
    detectedSections,
    fileType,
    originalFileName,
  };
}

/**
 * Dynamically loads PDF.js from cdnjs if not already present on window
 */
async function loadPdfJs(): Promise<any> {
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjs);
      } else {
        reject(new Error('PDF.js failed to initialize on window object.'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js script from CDN.'));
    document.head.appendChild(script);
  });
}

/**
 * Extracts raw text from a PDF file directly inside the browser using PDF.js
 */
async function parsePdfInBrowser(file: File): Promise<string> {
  const pdfjsLib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageStrings = content.items.map((item: any) => item.str || '');
    fullText += pageStrings.join(' ') + '\n';
  }

  return fullText;
}

/**
 * Main hybrid document parser:
 * 1. TXT/MD files: Parsed 100% in browser via FileReader
 * 2. DOCX files: Parsed 100% in browser via mammoth
 * 3. PDF files: Tries browser PDF.js extraction first, falls back to server API if needed
 */
export async function parseFileHybrid(file: File): Promise<ParseFileResponse> {
  const fileName = file.name;
  const lowerName = fileName.toLowerCase();
  const mimeType = file.type || '';

  // 1. Plain Text / Markdown
  if (mimeType.startsWith('text/') || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
    const text = await file.text();
    return buildParsedResponse(text, 'txt', fileName);
  }

  // 2. DOCX document
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 30) {
        return buildParsedResponse(result.value, 'docx', fileName);
      }
    } catch (err) {
      console.warn('Browser mammoth DOCX parse error, trying server fallback:', err);
    }
  }

  // 3. PDF document — Try browser PDF parsing first
  if (mimeType === 'application/pdf' || lowerName.endsWith('.pdf')) {
    try {
      const pdfText = await parsePdfInBrowser(file);
      if (pdfText && pdfText.trim().length > 30) {
        return buildParsedResponse(pdfText, 'pdf', fileName);
      }
    } catch (browserErr) {
      console.warn('Browser PDF.js extraction failed or timed out, trying server API fallback:', browserErr);
    }
  }

  // 4. Server API fallback for PDF or complex formats
  try {
    return await parseResumeFile(file);
  } catch (apiErr: any) {
    console.error('Server API file parse error:', apiErr);
    throw new Error(
      apiErr.message ||
        'Unable to parse this document. Please ensure it is a valid text-based PDF, DOCX, or TXT file, or paste your resume text into the text area below.'
    );
  }
}
