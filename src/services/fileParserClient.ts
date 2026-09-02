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
  if (!cleanedText || cleanedText.length < 20) {
    throw new Error(
      'This document contains insufficient or unreadable text. Please try another document or paste your resume text directly.'
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

/**
 * Pure JavaScript client-side stream text extractor for PDF documents.
 * Extracts textual content from uncompressed PDF text blocks (BT ... ET)
 * without requiring any external npm package or Web Workers.
 */
async function extractTextFromPdfStream(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Convert binary to latin1 string for stream pattern matching
  let binaryString = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, Math.min(i + chunkSize, bytes.length)))
    );
  }

  // Look for text inside PDF text operators (BT ... ET)
  const textChunks: string[] = [];
  
  // Extract text inside parentheses: (Some text) Tj or [(Some) -20 (text)] TJ
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(binaryString)) !== null) {
    const rawText = match[1];
    // Filter out binary control noise
    if (rawText && rawText.length > 1 && !/^[\x00-\x1F]+$/.test(rawText)) {
      textChunks.push(rawText);
    }
  }

  // Also check TJ array format: [ (Text) 10 (More) ] TJ
  const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(binaryString)) !== null) {
    const arrayContent = match[1];
    const subTjRegex = /\(([^)]+)\)/g;
    let subMatch: RegExpExecArray | null;
    while ((subMatch = subTjRegex.exec(arrayContent)) !== null) {
      if (subMatch[1] && subMatch[1].length > 1) {
        textChunks.push(subMatch[1]);
      }
    }
  }

  const combined = textChunks.join(' ').replace(/\\([()\\])/g, '$1');
  return cleanResumeText(combined);
}

/**
 * Main hybrid document parser:
 *  - TXT / MD: In-browser instant FileReader
 *  - DOCX: In-browser instant Mammoth
 *  - PDF: Tries server API (/api/parse-file) first; if unavailable, uses in-browser stream extractor.
 */
export async function parseFileHybrid(file: File): Promise<ParseFileResponse> {
  const lowerName = file.name.toLowerCase();
  const mime = file.type || '';

  // 1. Plain text / Markdown
  if (mime.startsWith('text/') || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
    try {
      const text = await file.text();
      return buildResponse(text, 'txt', file.name);
    } catch (txtErr: any) {
      console.error('Plain text parse failed:', txtErr);
      throw new Error(txtErr.message || 'Failed to read plain text document.');
    }
  }

  // 2. DOCX document
  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mime === 'application/msword' ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 20) {
        return buildResponse(result.value, 'docx', file.name);
      }
    } catch (docxErr) {
      console.warn('In-browser mammoth extraction notice:', docxErr);
    }
  }

  // 3. PDF document
  if (mime === 'application/pdf' || lowerName.endsWith('.pdf')) {
    // Strategy A: Call serverless /api/parse-file
    try {
      const serverResult = await parseResumeFile(file);
      if (serverResult && serverResult.text && serverResult.text.trim().length > 20) {
        return serverResult;
      }
    } catch (serverErr) {
      console.warn('Server parse-file notice, attempting direct stream extraction:', serverErr);
    }

    // Strategy B: Pure client stream text extraction
    try {
      const streamText = await extractTextFromPdfStream(file);
      if (streamText && streamText.length > 30) {
        return buildResponse(streamText, 'pdf', file.name);
      }
    } catch (streamErr) {
      console.warn('Stream extraction notice:', streamErr);
    }
  }

  // 4. Final attempt via server API if not yet tried
  try {
    return await parseResumeFile(file);
  } catch (finalErr: any) {
    console.error('Document parsing could not extract text:', finalErr);
    throw new Error(
      finalErr.message ||
        'Could not extract text from this document. Please ensure it is not a scanned image, or paste your resume text into the text area below.'
    );
  }
}
