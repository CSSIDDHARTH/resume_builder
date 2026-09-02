import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient, GEMINI_MODEL } from '../server/gemini';
import { REWRITE_SCHEMA, buildRewritePrompt } from '../server/prompts';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { originalText, sectionType, style, jobContext } = req.body;

    if (!originalText || typeof originalText !== 'string' || originalText.trim().length < 5) {
      res.status(400).json({ error: 'Please provide valid text to rewrite.' });
      return;
    }

    const validStyles = ['concise', 'technical', 'impact', 'ats'];
    const chosenStyle = validStyles.includes(style) ? style : 'impact';

    const ai = getGeminiClient();
    const prompt = buildRewritePrompt(originalText, sectionType || 'bullet', chosenStyle, jobContext);

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert resume writer. Never invent facts or numbers. Use bracketed placeholders when metrics are absent.',
        responseMimeType: 'application/json',
        responseSchema: REWRITE_SCHEMA as any,
        temperature: 0.3,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error('AI returned an empty response.');

    const parsed = JSON.parse(responseText);
    res.json({
      success: true,
      data: {
        originalText,
        rewrittenText: parsed.rewrittenText,
        style: parsed.style || chosenStyle,
        rationale: parsed.rationale,
        keyChangesMade: parsed.keyChangesMade || [],
        missingMetricsPrompt: parsed.missingMetricsPrompt || undefined,
      },
    });
  } catch (err: any) {
    console.error('Rewrite error:', err);
    res.status(500).json({ error: err.message || 'Failed to rewrite resume content' });
  }
}
