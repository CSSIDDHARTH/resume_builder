import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient, GEMINI_MODEL } from '../server/gemini';
import {
  RESUME_ANALYSIS_SCHEMA,
  buildResumeAnalysisPrompt,
} from '../server/prompts';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { resumeText, jobDescription, resumeName } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 40) {
      res.status(400).json({
        error:
          'Resume content is empty or too short. Please provide a complete resume text with at least 40 characters.',
      });
      return;
    }

    const ai = getGeminiClient();
    const prompt = buildResumeAnalysisPrompt(resumeText, jobDescription || '');

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are an authoritative, evidence-based technical resume auditor and ATS evaluator. Always output strict JSON matching the schema with zero metric hallucinations.',
        responseMimeType: 'application/json',
        responseSchema: RESUME_ANALYSIS_SCHEMA as any,
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error('AI engine returned an empty response.');

    let parsedResult: any;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Gemini JSON output:', responseText);
      throw new Error('AI analysis format validation failed. Please retry your analysis.');
    }

    const ats = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.atsCompatibility ?? 75)));
    const jobRel = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.jobRelevance ?? 70)));
    const skills = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.skillsMatch ?? 70)));
    const exp = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.experienceQuality ?? 75)));
    const proj = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.projectQuality ?? 75)));
    const clarity = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.contentClarity ?? 80)));

    const calculatedOverall = Math.round(
      ats * 0.2 + jobRel * 0.25 + skills * 0.2 + exp * 0.15 + proj * 0.1 + clarity * 0.1
    );

    const enrichedScores = {
      overall: calculatedOverall,
      atsCompatibility: ats,
      jobRelevance: jobRel,
      skillsMatch: skills,
      experienceQuality: exp,
      projectQuality: proj,
      contentClarity: clarity,
      scoreExplanation:
        parsedResult.scores?.scoreExplanation ||
        `Overall score of ${calculatedOverall}/100 is calculated with ATS Compatibility (20%), Job Relevance (25%), Skills Match (20%), Experience Quality (15%), Project Quality (10%), and Content & Clarity (10%).`,
    };

    const normalizedBullets = (
      parsedResult.bulletEvaluations || parsedResult.bulletPointEvaluations || []
    ).map((b: any, idx: number) => ({
      id: b.id || `bullet-${idx + 1}`,
      originalBullet: b.originalBullet || '',
      sectionTitle: b.sectionTitle || b.section || 'Work Experience',
      section: b.sectionTitle || b.section || 'Work Experience',
      score: typeof b.score === 'number' ? b.score : 70,
      actionVerbStrength: b.actionVerbStrength || 'average',
      quantifiableResultPresent: Boolean(b.quantifiableResultPresent),
      weakness:
        b.weakness ||
        (Array.isArray(b.issues) ? b.issues.join(' • ') : 'Could include more quantifiable metrics.'),
      issues: Array.isArray(b.issues) ? b.issues : b.weakness ? [b.weakness] : ['Lacks quantified scale metrics'],
      suggestedRewrite: b.suggestedRewrite || b.originalBullet || '',
      rationale: b.rationale || 'Enhanced with quantified results and strong action verbs.',
    }));

    const normalizedSections = (
      parsedResult.sectionAnalyses || parsedResult.sectionEvaluations || []
    ).map((s: any) => ({
      sectionName: s.sectionName || 'Section',
      score: typeof s.score === 'number' ? s.score : 75,
      present: s.present ?? true,
      strengths: Array.isArray(s.strengths) ? s.strengths : [],
      weaknesses: Array.isArray(s.weaknesses) ? s.weaknesses : [],
      recommendations: Array.isArray(s.recommendations)
        ? s.recommendations
        : s.recommendation
        ? [s.recommendation]
        : [],
      recommendation:
        s.recommendation || (Array.isArray(s.recommendations) ? s.recommendations[0] : ''),
    }));

    const finalReport = {
      id: 'analysis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      resumeName: resumeName || 'Candidate Resume',
      targetRole: parsedResult.targetRole || 'Target Position',
      targetCompany: parsedResult.targetCompany || '',
      scores: enrichedScores,
      atsAnalysis: {
        score: ats,
        overallSummary:
          parsedResult.atsAnalysis?.overallSummary || 'ATS formatting and scanner compatibility analysis.',
        formattingScore: parsedResult.atsAnalysis?.formattingScore ?? ats,
        headingsScore: parsedResult.atsAnalysis?.headingsScore ?? ats,
        readabilityScore: parsedResult.atsAnalysis?.readabilityScore ?? ats,
        contactInfoScore: parsedResult.atsAnalysis?.contactInfoScore ?? 90,
        dateConsistencyScore: parsedResult.atsAnalysis?.dateConsistencyScore ?? 85,
        factors: Array.isArray(parsedResult.atsAnalysis?.factors) ? parsedResult.atsAnalysis.factors : [],
        parsingRisks: Array.isArray(parsedResult.atsAnalysis?.parsingRisks)
          ? parsedResult.atsAnalysis.parsingRisks
          : [],
      },
      jobDetails: parsedResult.jobDetails || null,
      skillsMatch: Array.isArray(parsedResult.skillsMatch) ? parsedResult.skillsMatch : [],
      keywordAnalysis: {
        importantJobKeywords: Array.isArray(parsedResult.keywordAnalysis?.importantJobKeywords)
          ? parsedResult.keywordAnalysis.importantJobKeywords
          : [],
        presentInResume: Array.isArray(parsedResult.keywordAnalysis?.presentInResume)
          ? parsedResult.keywordAnalysis.presentInResume
          : [],
        missingKeywords: Array.isArray(parsedResult.keywordAnalysis?.missingKeywords)
          ? parsedResult.keywordAnalysis.missingKeywords
          : [],
        overusedKeywords: Array.isArray(parsedResult.keywordAnalysis?.overusedKeywords)
          ? parsedResult.keywordAnalysis.overusedKeywords
          : [],
        naturalSuggestions: Array.isArray(parsedResult.keywordAnalysis?.naturalSuggestions)
          ? parsedResult.keywordAnalysis.naturalSuggestions
          : [],
        antiStuffingWarning:
          parsedResult.keywordAnalysis?.antiStuffingWarning ||
          'Incorporate missing skills naturally through verified project and work accomplishments. Never engage in keyword dumping.',
      },
      skillGaps: Array.isArray(parsedResult.skillGaps) ? parsedResult.skillGaps : [],
      bulletPointEvaluations: normalizedBullets,
      bulletEvaluations: normalizedBullets,
      sectionEvaluations: normalizedSections,
      sectionAnalyses: normalizedSections,
      projectAnalyses: Array.isArray(parsedResult.projectAnalyses) ? parsedResult.projectAnalyses : [],
      suggestions: (parsedResult.suggestions || []).map((s: any, idx: number) => ({
        ...s,
        id: s.id || `sugg-${idx + 1}`,
      })),
      interviewQuestions: (parsedResult.interviewQuestions || []).map((q: any, idx: number) => ({
        ...q,
        id: q.id || `q-${idx + 1}`,
        keyTalkingPoints: Array.isArray(q.keyTalkingPoints)
          ? q.keyTalkingPoints
          : q.keyTalkingPoints
          ? [String(q.keyTalkingPoints)]
          : [],
      })),
      rawResumeTextSnippet:
        resumeText.substring(0, 500) + (resumeText.length > 500 ? '...' : ''),
      rawJobDescriptionSnippet:
        (jobDescription || '').substring(0, 500) + ((jobDescription || '').length > 500 ? '...' : ''),
    };

    res.json({ success: true, data: finalReport });
  } catch (err: any) {
    console.error('Analysis execution error:', err);
    res.status(500).json({
      error: err.message || 'An unexpected error occurred while analyzing the resume.',
    });
  }
}
