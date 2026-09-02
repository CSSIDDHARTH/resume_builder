import type { VercelRequest, VercelResponse } from '@vercel/node';
import multer from 'multer';
import path from 'path';
import { parseDocumentBuffer } from '../server/parser';

// Multer configured for Vercel (memory storage, no disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/markdown',
      'application/octet-stream',
    ];
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Unsupported file format. Please upload a PDF (.pdf), Microsoft Word (.docx), or Plain Text (.txt) document.'
        )
      );
    }
  },
});

// Helper: run multer as a promise
function runMiddleware(req: any, res: any, fn: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      resolve();
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Required: disable Vercel's default body parser so multer can handle multipart
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    await runMiddleware(req, res, upload.single('resumeFile'));

    const file = (req as any).file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded. Please select a resume file.' });
      return;
    }

    const parsed = await parseDocumentBuffer(file.buffer, file.mimetype, file.originalname);

    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('File parsing error:', err);
    res.status(400).json({
      error:
        err.message ||
        'We were unable to extract readable text from this file. Please verify the document format or try a DOCX/TXT file.',
    });
  }
}
