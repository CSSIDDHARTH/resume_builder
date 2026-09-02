import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Resume Analyzer API',
  });
}
