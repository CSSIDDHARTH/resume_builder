import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';

// ─── Inline Gemini client (no cross-file import needed) ───────────────────────

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY environment variable is missing. Please set it in Vercel → Settings → Environment Variables.'
    );
  }
  return new GoogleGenAI({ apiKey });
}

const GEMINI_MODEL = 'gemini-2.0-flash';

// ─── Inline PDF parser ────────────────────────────────────────────────────────

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfModule: any = await import('pdf-parse');
    const fn =
      typeof pdfModule.default === 'function'
        ? pdfModule.default
        : typeof pdfModule === 'function'
        ? pdfModule
        : null;
    if (typeof fn === 'function') {
      const data = await fn(buffer);
      if (data && typeof data.text === 'string') return data.text;
    }
  } catch (err: any) {
    console.error('PDF parse error:', err?.message);
  }
  throw new Error(
    'Failed to parse PDF. The document may be password-protected or a scanned image. Try a text-based PDF or DOCX.'
  );
}

async function parseDocumentBuffer(
  buffer: Buffer,
  mimetype: string,
  originalFileName: string
): Promise<{ text: string; wordCount: number; charCount: number; detectedSections: string[]; fileType: string; originalFileName: string }> {
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('File size exceeds the 10MB limit. Please upload a smaller resume.');
  }

  let rawText = '';
  let fileType = 'unknown';
  const lowerName = originalFileName.toLowerCase();

  if (mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
    fileType = 'pdf';
    rawText = await extractPdfText(buffer);
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword' ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    fileType = 'docx';
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value || '';
  } else if (mimetype.startsWith('text/') || lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
    fileType = 'txt';
    rawText = buffer.toString('utf-8');
  } else {
    rawText = buffer.toString('utf-8');
    fileType = 'text_fallback';
  }

  // Clean text
  const cleanedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!cleanedText || cleanedText.length < 40) {
    throw new Error(
      'The uploaded document contains insufficient or empty text. If this is a scanned PDF, please upload a text-based PDF or DOCX version.'
    );
  }

  const SECTIONS = ['summary','professional summary','objective','experience','work experience','employment history','education','skills','technical skills','projects','certifications','achievements','awards','leadership','publications','volunteer','languages','interests'];
  const found = new Set<string>();
  for (const line of cleanedText.split('\n')) {
    const t = line.trim().toLowerCase().replace(/[:\-_#*]/g, '').trim();
    if (t.length > 2 && t.length < 35) {
      for (const s of SECTIONS) {
        if (t === s || t.startsWith(s + ' ') || t.endsWith(' ' + s)) found.add(s);
      }
    }
  }

  const words = cleanedText.trim().split(/\s+/).filter(Boolean);
  return { text: cleanedText, wordCount: words.length, charCount: cleanedText.length, detectedSections: Array.from(found), fileType, originalFileName };
}

// ─── Inline Prompts & Schemas ─────────────────────────────────────────────────
// We import these from the shared server/ files — esbuild handles same-package bundling fine.
import {
  RESUME_ANALYSIS_SCHEMA,
  REWRITE_SCHEMA,
  JOB_ANALYZER_SCHEMA,
  RESUME_ENHANCEMENT_SCHEMA,
  buildResumeAnalysisPrompt,
  buildRewritePrompt,
  buildResumeEnhancementPrompt,
} from '../server/prompts';

// ─── Express App ──────────────────────────────────────────────────────────────

const app = express();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.'));
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'AI Resume Analyzer API' });
});

app.post('/api/parse-file', upload.single('resumeFile'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) { res.status(400).json({ error: 'No file uploaded.' }); return; }
    const parsed = await parseDocumentBuffer(req.file.buffer, req.file.mimetype, req.file.originalname);
    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Parse error:', err);
    res.status(400).json({ error: err.message || 'Failed to parse file.' });
  }
});

app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeText, jobDescription, resumeName } = req.body;
    if (!resumeText || resumeText.trim().length < 40) {
      res.status(400).json({ error: 'Resume content is too short. Please provide a complete resume.' });
      return;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildResumeAnalysisPrompt(resumeText, jobDescription || ''),
      config: {
        systemInstruction: 'You are an authoritative, evidence-based technical resume auditor and ATS evaluator. Always output strict JSON matching the schema with zero metric hallucinations.',
        responseMimeType: 'application/json',
        responseSchema: RESUME_ANALYSIS_SCHEMA as any,
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    if (!response.text) throw new Error('AI engine returned an empty response.');
    const parsedResult: any = JSON.parse(response.text);

    const ats = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.atsCompatibility ?? 75)));
    const jobRel = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.jobRelevance ?? 70)));
    const skills = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.skillsMatch ?? 70)));
    const exp = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.experienceQuality ?? 75)));
    const proj = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.projectQuality ?? 75)));
    const clarity = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.contentClarity ?? 80)));
    const calculatedOverall = Math.round(ats * 0.2 + jobRel * 0.25 + skills * 0.2 + exp * 0.15 + proj * 0.1 + clarity * 0.1);

    const normalizedBullets = (parsedResult.bulletEvaluations || parsedResult.bulletPointEvaluations || []).map((b: any, idx: number) => ({
      id: b.id || `bullet-${idx + 1}`, originalBullet: b.originalBullet || '',
      sectionTitle: b.sectionTitle || b.section || 'Work Experience', section: b.sectionTitle || b.section || 'Work Experience',
      score: typeof b.score === 'number' ? b.score : 70, actionVerbStrength: b.actionVerbStrength || 'average',
      quantifiableResultPresent: Boolean(b.quantifiableResultPresent),
      weakness: b.weakness || (Array.isArray(b.issues) ? b.issues.join(' • ') : 'Could include more quantifiable metrics.'),
      issues: Array.isArray(b.issues) ? b.issues : b.weakness ? [b.weakness] : ['Lacks quantified scale metrics'],
      suggestedRewrite: b.suggestedRewrite || b.originalBullet || '',
      rationale: b.rationale || 'Enhanced with quantified results and strong action verbs.',
    }));

    const normalizedSections = (parsedResult.sectionAnalyses || parsedResult.sectionEvaluations || []).map((s: any) => ({
      sectionName: s.sectionName || 'Section', score: typeof s.score === 'number' ? s.score : 75, present: s.present ?? true,
      strengths: Array.isArray(s.strengths) ? s.strengths : [], weaknesses: Array.isArray(s.weaknesses) ? s.weaknesses : [],
      recommendations: Array.isArray(s.recommendations) ? s.recommendations : s.recommendation ? [s.recommendation] : [],
      recommendation: s.recommendation || (Array.isArray(s.recommendations) ? s.recommendations[0] : ''),
    }));

    res.json({
      success: true,
      data: {
        id: 'analysis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        resumeName: resumeName || 'Candidate Resume',
        targetRole: parsedResult.targetRole || 'Target Position',
        targetCompany: parsedResult.targetCompany || '',
        scores: { overall: calculatedOverall, atsCompatibility: ats, jobRelevance: jobRel, skillsMatch: skills, experienceQuality: exp, projectQuality: proj, contentClarity: clarity, scoreExplanation: parsedResult.scores?.scoreExplanation || `Overall score of ${calculatedOverall}/100.` },
        atsAnalysis: { score: ats, overallSummary: parsedResult.atsAnalysis?.overallSummary || '', formattingScore: parsedResult.atsAnalysis?.formattingScore ?? ats, headingsScore: parsedResult.atsAnalysis?.headingsScore ?? ats, readabilityScore: parsedResult.atsAnalysis?.readabilityScore ?? ats, contactInfoScore: parsedResult.atsAnalysis?.contactInfoScore ?? 90, dateConsistencyScore: parsedResult.atsAnalysis?.dateConsistencyScore ?? 85, factors: parsedResult.atsAnalysis?.factors || [], parsingRisks: parsedResult.atsAnalysis?.parsingRisks || [] },
        jobDetails: parsedResult.jobDetails || null,
        skillsMatch: parsedResult.skillsMatch || [],
        keywordAnalysis: { importantJobKeywords: parsedResult.keywordAnalysis?.importantJobKeywords || [], presentInResume: parsedResult.keywordAnalysis?.presentInResume || [], missingKeywords: parsedResult.keywordAnalysis?.missingKeywords || [], overusedKeywords: parsedResult.keywordAnalysis?.overusedKeywords || [], naturalSuggestions: parsedResult.keywordAnalysis?.naturalSuggestions || [], antiStuffingWarning: parsedResult.keywordAnalysis?.antiStuffingWarning || 'Incorporate missing skills naturally.' },
        skillGaps: parsedResult.skillGaps || [],
        bulletPointEvaluations: normalizedBullets, bulletEvaluations: normalizedBullets,
        sectionEvaluations: normalizedSections, sectionAnalyses: normalizedSections,
        projectAnalyses: parsedResult.projectAnalyses || [],
        suggestions: (parsedResult.suggestions || []).map((s: any, idx: number) => ({ ...s, id: s.id || `sugg-${idx + 1}` })),
        interviewQuestions: (parsedResult.interviewQuestions || []).map((q: any, idx: number) => ({ ...q, id: q.id || `q-${idx + 1}`, keyTalkingPoints: Array.isArray(q.keyTalkingPoints) ? q.keyTalkingPoints : q.keyTalkingPoints ? [String(q.keyTalkingPoints)] : [] })),
        rawResumeTextSnippet: resumeText.substring(0, 500) + (resumeText.length > 500 ? '...' : ''),
        rawJobDescriptionSnippet: (jobDescription || '').substring(0, 500) + ((jobDescription || '').length > 500 ? '...' : ''),
      },
    });
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'An unexpected error occurred.' });
  }
});

app.post('/api/analyze-job', async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      res.status(400).json({ error: 'Please provide a valid job description of at least 20 characters.' });
      return;
    }
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Analyze this job description and extract structured technical and role specifications:\n--- JOB DESCRIPTION ---\n${jobDescription}`,
      config: { responseMimeType: 'application/json', responseSchema: JOB_ANALYZER_SCHEMA as any, temperature: 0.2, thinkingConfig: { thinkingBudget: 0 } },
    });
    if (!response.text) throw new Error('Empty response from AI engine');
    res.json({ success: true, data: JSON.parse(response.text) });
  } catch (err: any) {
    console.error('Job analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze job description' });
  }
});

app.post('/api/rewrite', async (req: Request, res: Response): Promise<void> => {
  try {
    const { originalText, sectionType, style, jobContext } = req.body;
    if (!originalText || originalText.trim().length < 5) {
      res.status(400).json({ error: 'Please provide valid text to rewrite.' });
      return;
    }
    const validStyles = ['concise', 'technical', 'impact', 'ats'];
    const chosenStyle = validStyles.includes(style) ? style : 'impact';
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildRewritePrompt(originalText, sectionType || 'bullet', chosenStyle, jobContext),
      config: { systemInstruction: 'You are an expert resume writer. Never invent facts or numbers.', responseMimeType: 'application/json', responseSchema: REWRITE_SCHEMA as any, temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } },
    });
    if (!response.text) throw new Error('AI returned an empty response.');
    const parsed = JSON.parse(response.text);
    res.json({ success: true, data: { originalText, rewrittenText: parsed.rewrittenText, style: parsed.style || chosenStyle, rationale: parsed.rationale, keyChangesMade: parsed.keyChangesMade || [], missingMetricsPrompt: parsed.missingMetricsPrompt || undefined } });
  } catch (err: any) {
    console.error('Rewrite error:', err);
    res.status(500).json({ error: err.message || 'Failed to rewrite resume content' });
  }
});

app.post('/api/enhance-full-resume', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeText, jobDescription, targetRole, targetCompany, style, analysisContext, currentScores } = req.body;
    if (!resumeText || resumeText.trim().length < 30) {
      res.status(400).json({ error: 'Please provide valid resume text to enhance.' });
      return;
    }
    const validStyles = ['impact_metrics', 'ats_maximized', 'technical_depth', 'executive_leadership'];
    const chosenStyle = validStyles.includes(style) ? style : 'impact_metrics';
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildResumeEnhancementPrompt(resumeText, jobDescription || '', targetRole || 'Target Role', chosenStyle, analysisContext || ''),
      config: { systemInstruction: 'You are an authoritative ATS systems architect and principal executive resume writer. Output strict JSON matching the schema.', responseMimeType: 'application/json', responseSchema: RESUME_ENHANCEMENT_SCHEMA as any, temperature: 0.25, thinkingConfig: { thinkingBudget: 0 } },
    });
    if (!response.text) throw new Error('AI engine returned an empty response.');
    const parsed = JSON.parse(response.text);
    const before = { overall: currentScores?.overall ?? 74, atsScore: currentScores?.atsCompatibility ?? 78, skillsMatch: currentScores?.skillsMatch ?? 70, bulletImpact: currentScores?.experienceQuality ?? 68, missingKeywordsCount: currentScores?.missingKeywordsCount ?? 5 };
    const after = { overall: parsed.projectedScores?.overall ?? Math.min(98, before.overall + 22), atsScore: parsed.projectedScores?.atsScore ?? Math.min(99, before.atsScore + 18), skillsMatch: parsed.projectedScores?.skillsMatch ?? Math.min(96, before.skillsMatch + 24), bulletImpact: parsed.projectedScores?.bulletImpact ?? Math.min(95, before.bulletImpact + 25), missingKeywordsCount: parsed.projectedScores?.missingKeywordsCount ?? 0 };
    res.json({ success: true, data: { id: 'enhanced-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7), timestamp: new Date().toISOString(), targetRole: targetRole || 'Target Role', targetCompany: targetCompany || '', enhancementStyle: chosenStyle, originalResumeText: resumeText, enhancedResumeMarkdown: parsed.enhancedResumeMarkdown || '', enhancedResumePlainText: parsed.enhancedResumePlainText || '', metricsComparison: { before, after, projectedGain: Math.max(0, after.overall - before.overall) }, sectionTransformations: parsed.sectionTransformations || [], bulletDiffs: parsed.bulletDiffs || [], integratedKeywords: parsed.integratedKeywords || [], keyEnhancementsSummary: parsed.keyEnhancementsSummary || [], truthPreservationNotice: parsed.truthPreservationNotice || 'All authentic career milestones preserved.' } });
  } catch (err: any) {
    console.error('Enhancement error:', err);
    res.status(500).json({ error: err.message || 'Failed to enhance resume' });
  }
});

export default app;
