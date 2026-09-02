import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient, GEMINI_MODEL } from '../server/gemini';
import { JOB_ANALYZER_SCHEMA } from '../server/prompts';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      res.status(400).json({
        error: 'Please provide a valid job description of at least 20 characters.',
      });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Analyze this job description and extract structured technical and role specifications:\n--- JOB DESCRIPTION ---\n${jobDescription}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: JOB_ANALYZER_SCHEMA as any,
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error('Empty response from AI engine');

    const parsed = JSON.parse(responseText);
    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Job analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze job description' });
  }
}
