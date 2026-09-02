import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

export interface ParsedDocument {
  text: string;
  wordCount: number;
  charCount: number;
  detectedSections: string[];
  fileType: string;
  originalFileName: string;
}

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

/**
 * Extract plain text from a PDF buffer using pdf-parse v2 API
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // Strategy 1: Using PDFParse class (pdf-parse v2+)
  try {
    if (typeof PDFParse === 'function') {
      const parser = new PDFParse({
        data: buffer,
        verbosity: 0,
      });
      try {
        const textResult = await parser.getText();
        if (textResult && typeof textResult.text === 'string') {
          return textResult.text;
        }
      } finally {
        if (parser && typeof parser.destroy === 'function') {
          await parser.destroy().catch(() => {});
        }
      }
    }
  } catch (err: any) {
    console.warn('PDFParse class extraction attempt failed, trying dynamic fallback:', err?.message || err);
  }

  // Strategy 2: Dynamic import / CJS interop fallback
  try {
    const pdfModule: any = await import('pdf-parse');
    const ParserClass = pdfModule.PDFParse || pdfModule.default?.PDFParse;
    if (typeof ParserClass === 'function') {
      const parser = new ParserClass({
        data: buffer,
        verbosity: 0,
      });
      try {
        const textResult = await parser.getText();
        if (textResult && typeof textResult.text === 'string') {
          return textResult.text;
        }
      } finally {
        if (parser && typeof parser.destroy === 'function') {
          await parser.destroy().catch(() => {});
        }
      }
    }

    const fn = typeof pdfModule.default === 'function' ? pdfModule.default : (typeof pdfModule === 'function' ? pdfModule : null);
    if (typeof fn === 'function') {
      const data = await fn(buffer);
      if (data && typeof data.text === 'string') {
        return data.text;
      }
    }
  } catch (err: any) {
    console.error('PDF dynamic fallback failed:', err);
  }

  throw new Error(
    'Failed to parse PDF file. The document may be password-protected, encrypted, or contain unreadable scanned images. Please try exporting as text or DOCX.'
  );
}

export async function parseDocumentBuffer(
  buffer: Buffer,
  mimetype: string,
  originalFileName: string
): Promise<ParsedDocument> {
  // Validate maximum size (10 MB)
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('File size exceeds the 10MB limit. Please upload a smaller resume.');
  }

  let rawText = '';
  let fileType = 'unknown';

  const lowerName = originalFileName.toLowerCase();

  if (
    mimetype === 'application/pdf' ||
    lowerName.endsWith('.pdf')
  ) {
    fileType = 'pdf';
    rawText = await extractPdfText(buffer);
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword' ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    fileType = 'docx';
    try {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || '';
    } catch (err: any) {
      console.error('DOCX parsing error:', err);
      throw new Error(`Failed to parse DOCX document: ${err.message || 'Corrupted file'}`);
    }
  } else if (
    mimetype.startsWith('text/') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md')
  ) {
    fileType = 'txt';
    rawText = buffer.toString('utf-8');
  } else {
    // Attempt fallback utf-8 string if reasonable
    try {
      rawText = buffer.toString('utf-8');
      fileType = 'text_fallback';
    } catch {
      throw new Error(
        `Unsupported file type (${mimetype}). Please upload a PDF, DOCX, or plain text (.txt/.md) resume.`
      );
    }
  }

  // Clean and sanitize text
  const cleanedText = cleanResumeText(rawText);

  if (!cleanedText || cleanedText.trim().length < 40) {
    throw new Error(
      'The uploaded document contains insufficient or empty text. If this is a scanned PDF, please upload a text-based PDF or DOCX version.'
    );
  }

  const detectedSections = detectResumeSections(cleanedText);
  const words = cleanedText.trim().split(/\s+/).filter(Boolean);

  return {
    text: cleanedText,
    wordCount: words.length,
    charCount: cleanedText.length,
    detectedSections,
    fileType,
    originalFileName,
  };
}

function cleanResumeText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove non-printable control characters except standard whitespace
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize excessive blank lines
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
