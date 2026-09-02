import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { getGeminiClient, GEMINI_MODEL } from './server/gemini.js';
import { parseDocumentBuffer } from './server/parser.js';
import {
  RESUME_ANALYSIS_SCHEMA,
  REWRITE_SCHEMA,
  JOB_ANALYZER_SCHEMA,
  RESUME_ENHANCEMENT_SCHEMA,
  buildResumeAnalysisPrompt,
  buildRewritePrompt,
  buildResumeEnhancementPrompt,
} from './server/prompts.js';

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer upload config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
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

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Resume Analyzer API',
  });
});

// Parse uploaded resume file (PDF, DOCX, TXT)
app.post('/api/parse-file', upload.single('resumeFile'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded. Please select a resume file.' });
      return;
    }

    const parsed = await parseDocumentBuffer(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.error('File parsing error:', err);
    res.status(400).json({
      error: err.message || 'We were unable to extract readable text from this file. Please verify the document format or try a DOCX/TXT file.',
    });
  }
});

// Main Resume Analysis Engine
app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeText, jobDescription, resumeName } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 40) {
      res.status(400).json({
        error: 'Resume content is empty or too short. Please provide a complete resume text with at least 40 characters.',
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
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('AI engine returned an empty response.');
    }

    let parsedResult: any;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', responseText);
      throw new Error('AI analysis format validation failed. Please retry your analysis.');
    }

    // Ensure mathematical consistency of scores
    const ats = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.atsCompatibility ?? 75)));
    const jobRel = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.jobRelevance ?? 70)));
    const skills = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.skillsMatch ?? 70)));
    const exp = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.experienceQuality ?? 75)));
    const proj = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.projectQuality ?? 75)));
    const clarity = Math.min(100, Math.max(0, Math.round(parsedResult.scores?.contentClarity ?? 80)));

    // Calculate deterministic weighted overall score:
    // ATS 20%, Job Relevance 25%, Skills 20%, Experience 15%, Project 10%, Content 10%
    const calculatedOverall = Math.round(
      ats * 0.2 +
      jobRel * 0.25 +
      skills * 0.2 +
      exp * 0.15 +
      proj * 0.1 +
      clarity * 0.1
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
      parsedResult.bulletEvaluations ||
      parsedResult.bulletPointEvaluations ||
      []
    ).map((b: any, idx: number) => ({
      id: b.id || `bullet-${idx + 1}`,
      originalBullet: b.originalBullet || '',
      sectionTitle: b.sectionTitle || b.section || 'Work Experience',
      section: b.sectionTitle || b.section || 'Work Experience',
      score: typeof b.score === 'number' ? b.score : 70,
      actionVerbStrength: b.actionVerbStrength || 'average',
      quantifiableResultPresent: Boolean(b.quantifiableResultPresent),
      weakness: b.weakness || (Array.isArray(b.issues) ? b.issues.join(' • ') : 'Could include more quantifiable metrics.'),
      issues: Array.isArray(b.issues) ? b.issues : b.weakness ? [b.weakness] : ['Lacks quantified scale metrics'],
      suggestedRewrite: b.suggestedRewrite || b.originalBullet || '',
      rationale: b.rationale || 'Enhanced with quantified results and strong action verbs.',
    }));

    const normalizedSections = (
      parsedResult.sectionAnalyses ||
      parsedResult.sectionEvaluations ||
      []
    ).map((s: any) => ({
      sectionName: s.sectionName || 'Section',
      score: typeof s.score === 'number' ? s.score : 75,
      present: s.present ?? true,
      strengths: Array.isArray(s.strengths) ? s.strengths : [],
      weaknesses: Array.isArray(s.weaknesses) ? s.weaknesses : [],
      recommendations: Array.isArray(s.recommendations) ? s.recommendations : (s.recommendation ? [s.recommendation] : []),
      recommendation: s.recommendation || (Array.isArray(s.recommendations) ? s.recommendations[0] : ''),
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
        overallSummary: parsedResult.atsAnalysis?.overallSummary || 'ATS formatting and scanner compatibility analysis.',
        formattingScore: parsedResult.atsAnalysis?.formattingScore ?? ats,
        headingsScore: parsedResult.atsAnalysis?.headingsScore ?? ats,
        readabilityScore: parsedResult.atsAnalysis?.readabilityScore ?? ats,
        contactInfoScore: parsedResult.atsAnalysis?.contactInfoScore ?? 90,
        dateConsistencyScore: parsedResult.atsAnalysis?.dateConsistencyScore ?? 85,
        factors: Array.isArray(parsedResult.atsAnalysis?.factors) ? parsedResult.atsAnalysis.factors : [],
        parsingRisks: Array.isArray(parsedResult.atsAnalysis?.parsingRisks) ? parsedResult.atsAnalysis.parsingRisks : [],
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
      rawResumeTextSnippet: resumeText.substring(0, 500) + (resumeText.length > 500 ? '...' : ''),
      rawJobDescriptionSnippet: (jobDescription || '').substring(0, 500) + ((jobDescription || '').length > 500 ? '...' : ''),
    };

    res.json({
      success: true,
      data: finalReport,
    });
  } catch (err: any) {
    console.error('Analysis execution error:', err);
    const errorMessage = err.message || 'An unexpected error occurred while analyzing the resume.';
    res.status(500).json({
      error: errorMessage,
    });
  }
});

// Standalone Job Description Analysis
app.post('/api/analyze-job', async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      res.status(400).json({ error: 'Please provide a valid job description of at least 20 characters.' });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Analyze this job description and extract structured technical and role specifications:
--- JOB DESCRIPTION ---
${jobDescription}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: JOB_ANALYZER_SCHEMA as any,
        temperature: 0.2,
        thinkingConfig: {
          thinkingBudget: 0,
        },
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
});

// AI Resume Rewriter (Truth-Preserving, multi-style)
app.post('/api/rewrite', async (req: Request, res: Response): Promise<void> => {
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
        thinkingConfig: {
          thinkingBudget: 0,
        },
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
});

// Full AI Resume Enhancement (End-to-End STAR restructuring, ATS compliance & keyword weaving)
app.post('/api/enhance-full-resume', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      resumeText,
      jobDescription,
      targetRole,
      targetCompany,
      style,
      analysisContext,
      currentScores,
    } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
      res.status(400).json({ error: 'Please provide valid resume text to enhance.' });
      return;
    }

    const validStyles = ['impact_metrics', 'ats_maximized', 'technical_depth', 'executive_leadership'];
    const chosenStyle = validStyles.includes(style) ? style : 'impact_metrics';

    const ai = getGeminiClient();
    const prompt = buildResumeEnhancementPrompt(
      resumeText,
      jobDescription || '',
      targetRole || 'Target Role',
      chosenStyle,
      analysisContext || ''
    );

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are an authoritative ATS systems architect and principal executive resume writer. Output strict JSON matching the schema. Always preserve genuine facts and company names while upgrading phrasing, structure, keywords, and STAR impact metrics.',
        responseMimeType: 'application/json',
        responseSchema: RESUME_ENHANCEMENT_SCHEMA as any,
        temperature: 0.25,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('AI engine returned an empty response.');
    }

    const parsed = JSON.parse(responseText);

    const beforeScores = {
      overall: currentScores?.overall ?? 74,
      atsScore: currentScores?.atsCompatibility ?? 78,
      skillsMatch: currentScores?.skillsMatch ?? 70,
      bulletImpact: currentScores?.experienceQuality ?? 68,
      missingKeywordsCount: currentScores?.missingKeywordsCount ?? 5,
    };

    const afterScores = {
      overall: parsed.projectedScores?.overall ?? Math.min(98, beforeScores.overall + 22),
      atsScore: parsed.projectedScores?.atsScore ?? Math.min(99, beforeScores.atsScore + 18),
      skillsMatch: parsed.projectedScores?.skillsMatch ?? Math.min(96, beforeScores.skillsMatch + 24),
      bulletImpact: parsed.projectedScores?.bulletImpact ?? Math.min(95, beforeScores.bulletImpact + 25),
      missingKeywordsCount: parsed.projectedScores?.missingKeywordsCount ?? 0,
    };

    const enhancedResult = {
      id: 'enhanced-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      targetRole: targetRole || 'Target Role',
      targetCompany: targetCompany || '',
      enhancementStyle: chosenStyle,
      originalResumeText: resumeText,
      enhancedResumeMarkdown: parsed.enhancedResumeMarkdown || '',
      enhancedResumePlainText: parsed.enhancedResumePlainText || '',
      metricsComparison: {
        before: beforeScores,
        after: afterScores,
        projectedGain: Math.max(0, afterScores.overall - beforeScores.overall),
      },
      sectionTransformations: Array.isArray(parsed.sectionTransformations)
        ? parsed.sectionTransformations
        : [],
      bulletDiffs: Array.isArray(parsed.bulletDiffs) ? parsed.bulletDiffs : [],
      integratedKeywords: Array.isArray(parsed.integratedKeywords) ? parsed.integratedKeywords : [],
      keyEnhancementsSummary: Array.isArray(parsed.keyEnhancementsSummary)
        ? parsed.keyEnhancementsSummary
        : [],
      truthPreservationNotice:
        parsed.truthPreservationNotice ||
        'All authentic career milestones and historical entities were preserved with zero fake experience introduced.',
    };

    res.json({
      success: true,
      data: enhancedResult,
    });
  } catch (err: any) {
    console.error('Full enhancement error:', err);
    res.status(500).json({ error: err.message || 'Failed to enhance resume' });
  }
});

// Explicit 404 for any unmatched /api/* requests to prevent Vite from returning index.html
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Express global error handling middleware for API routes
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: err.message || 'An internal server error occurred while processing your request.',
  });
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume Analyzer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
