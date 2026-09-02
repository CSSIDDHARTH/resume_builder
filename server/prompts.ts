import { Type } from '@google/genai';

export const RESUME_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    targetRole: {
      type: Type.STRING,
      description: 'Extracted job role title from the job description.',
    },
    targetCompany: {
      type: Type.STRING,
      description: 'Extracted target company name if present in the job description.',
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        atsCompatibility: {
          type: Type.NUMBER,
          description: 'Score from 0-100 evaluating ATS parsing friendliness, structure, headings, contact info, and layout clarity.',
        },
        jobRelevance: {
          type: Type.NUMBER,
          description: 'Score from 0-100 evaluating relevance of career history and experience to target job responsibilities.',
        },
        skillsMatch: {
          type: Type.NUMBER,
          description: 'Score from 0-100 evaluating evidence-based match for technical, tool, and domain competencies.',
        },
        experienceQuality: {
          type: Type.NUMBER,
          description: 'Score from 0-100 evaluating depth of experience, progression, leadership, and responsibilities.',
        },
        projectQuality: {
          type: Type.NUMBER,
          description: 'Score from 0-100 evaluating STAR approach, technical depth, problem-solving, and outcome metrics.',
        },
        contentClarity: {
          type: Type.NUMBER,
          description: 'Score from 0-100 evaluating grammar, active verbs, conciseness, formatting flow, and lack of fluff.',
        },
        scoreExplanation: {
          type: Type.STRING,
          description: 'Detailed paragraph explaining mathematically and qualitatively why the overall weighted score was awarded.',
        },
      },
      required: [
        'atsCompatibility',
        'jobRelevance',
        'skillsMatch',
        'experienceQuality',
        'projectQuality',
        'contentClarity',
        'scoreExplanation',
      ],
    },
    atsAnalysis: {
      type: Type.OBJECT,
      properties: {
        overallSummary: {
          type: Type.STRING,
          description: 'High-level synthesis of ATS strengths and risks.',
        },
        formattingScore: { type: Type.NUMBER },
        headingsScore: { type: Type.NUMBER },
        readabilityScore: { type: Type.NUMBER },
        contactInfoScore: { type: Type.NUMBER },
        dateConsistencyScore: { type: Type.NUMBER },
        parsingRisks: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Potential ATS hazards such as multi-column layouts, missing standard headings, non-standard symbols.',
        },
        factors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              factorName: { type: Type.STRING },
              status: {
                type: Type.STRING,
                description: 'passed | warning | failed',
              },
              score: { type: Type.NUMBER },
              description: { type: Type.STRING },
              impact: { type: Type.STRING },
              recommendation: { type: Type.STRING },
            },
            required: ['factorName', 'status', 'score', 'description', 'impact', 'recommendation'],
          },
        },
      },
      required: [
        'overallSummary',
        'formattingScore',
        'headingsScore',
        'readabilityScore',
        'contactInfoScore',
        'dateConsistencyScore',
        'parsingRisks',
        'factors',
      ],
    },
    jobDetails: {
      type: Type.OBJECT,
      properties: {
        roleTitle: { type: Type.STRING },
        companyName: { type: Type.STRING },
        experienceYears: { type: Type.STRING },
        requiredSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        preferredSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        keyResponsibilities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        technicalStack: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        domainKnowledge: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        educationRequirements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        extractedKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        'roleTitle',
        'requiredSkills',
        'preferredSkills',
        'keyResponsibilities',
        'technicalStack',
        'domainKnowledge',
        'educationRequirements',
        'extractedKeywords',
      ],
    },
    skillsMatch: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          category: {
            type: Type.STRING,
            description: 'technical | soft | tool | framework | language | domain | certification',
          },
          status: {
            type: Type.STRING,
            description: 'strong | partial | missing | insufficient_evidence',
          },
          importance: {
            type: Type.STRING,
            description: 'required | preferred',
          },
          resumeEvidence: {
            type: Type.STRING,
            description: 'Direct quote or factual evidence from resume. If none, write "None found in resume".',
          },
          recommendation: { type: Type.STRING },
        },
        required: ['skill', 'category', 'status', 'importance', 'resumeEvidence', 'recommendation'],
      },
    },
    keywordAnalysis: {
      type: Type.OBJECT,
      properties: {
        importantJobKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        presentInResume: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        missingKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        overusedKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        naturalSuggestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              contextRecommendation: { type: Type.STRING },
            },
            required: ['keyword', 'contextRecommendation'],
          },
        },
        antiStuffingWarning: {
          type: Type.STRING,
          description: 'Guidance warning against unnatural keyword dumping or fabrication.',
        },
      },
      required: [
        'importantJobKeywords',
        'presentInResume',
        'missingKeywords',
        'overusedKeywords',
        'naturalSuggestions',
        'antiStuffingWarning',
      ],
    },
    skillGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          jobRequirement: { type: Type.STRING },
          category: { type: Type.STRING },
          resumeEvidence: { type: Type.STRING },
          status: {
            type: Type.STRING,
            description: 'strong | partial | missing | insufficient_evidence',
          },
          gapDescription: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
        },
        required: ['jobRequirement', 'category', 'resumeEvidence', 'status', 'gapDescription', 'recommendedAction'],
      },
    },
    bulletEvaluations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          originalBullet: { type: Type.STRING },
          sectionTitle: { type: Type.STRING },
          status: {
            type: Type.STRING,
            description: 'strong | needs_improvement | weak',
          },
          hasActionVerb: { type: Type.BOOLEAN },
          hasTaskContext: { type: Type.BOOLEAN },
          hasQuantifiableResult: { type: Type.BOOLEAN },
          critique: { type: Type.STRING },
          suggestedRewrite: {
            type: Type.STRING,
            description: 'Improved STAR bullet without inventing fake metrics. Use bracketed placeholders like [reduced latency by X%] if metric is missing.',
          },
          userMetricPlaceholderNotice: { type: Type.STRING },
        },
        required: [
          'id',
          'originalBullet',
          'sectionTitle',
          'status',
          'hasActionVerb',
          'hasTaskContext',
          'hasQuantifiableResult',
          'critique',
          'suggestedRewrite',
        ],
      },
    },
    sectionAnalyses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sectionName: { type: Type.STRING },
          score: { type: Type.NUMBER },
          present: { type: Type.BOOLEAN },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          problems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggestedImprovements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['sectionName', 'score', 'present', 'strengths', 'problems', 'recommendations', 'suggestedImprovements'],
      },
    },
    projectAnalyses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          problemIdentified: { type: Type.STRING },
          technologiesUsed: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          technicalComplexity: {
            type: Type.STRING,
            description: 'high | medium | low',
          },
          userImpact: { type: Type.STRING },
          resultsReported: { type: Type.STRING },
          scalabilityNoted: { type: Type.BOOLEAN },
          originalityRating: {
            type: Type.STRING,
            description: 'high | medium | standard',
          },
          demonstratesSTAR: { type: Type.BOOLEAN },
          improvementSuggestion: { type: Type.STRING },
        },
        required: [
          'projectName',
          'problemIdentified',
          'technologiesUsed',
          'technicalComplexity',
          'userImpact',
          'resultsReported',
          'scalabilityNoted',
          'originalityRating',
          'demonstratesSTAR',
          'improvementSuggestion',
        ],
      },
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          priority: {
            type: Type.STRING,
            description: 'critical | high | medium | optional',
          },
          category: {
            type: Type.STRING,
            description: 'ATS | Skills | Impact | Clarity | Structure | Experience | Projects',
          },
          title: { type: Type.STRING },
          issue: { type: Type.STRING },
          whyItMatters: { type: Type.STRING },
          concreteRecommendation: { type: Type.STRING },
          sectionAffected: { type: Type.STRING },
        },
        required: ['id', 'priority', 'category', 'title', 'issue', 'whyItMatters', 'concreteRecommendation', 'sectionAffected'],
      },
    },
    interviewQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: {
            type: Type.STRING,
            description: 'resume_deep_dive | technical | behavioral | project_deep_dive',
          },
          question: { type: Type.STRING },
          contextOrRationale: { type: Type.STRING },
          focusTalkingPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          targetTechnologyOrTopic: { type: Type.STRING },
          relatedProjectName: { type: Type.STRING },
        },
        required: ['id', 'category', 'question', 'contextOrRationale', 'focusTalkingPoints'],
      },
    },
  },
  required: [
    'targetRole',
    'scores',
    'atsAnalysis',
    'jobDetails',
    'skillsMatch',
    'keywordAnalysis',
    'skillGaps',
    'bulletEvaluations',
    'sectionAnalyses',
    'projectAnalyses',
    'suggestions',
    'interviewQuestions',
  ],
};

export const REWRITE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    rewrittenText: {
      type: Type.STRING,
      description: 'The newly rewritten resume bullet or section.',
    },
    style: {
      type: Type.STRING,
      description: 'concise | technical | impact | ats',
    },
    rationale: {
      type: Type.STRING,
      description: 'Why this rewritten version is more compelling and effective.',
    },
    keyChangesMade: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Bullet list of exact structural and linguistic enhancements.',
    },
    missingMetricsPrompt: {
      type: Type.STRING,
      description: 'Clear prompt advising user where they should substitute brackets with genuine data (e.g., "[Insert validated throughput numbers if known]").',
    },
  },
  required: ['rewrittenText', 'style', 'rationale', 'keyChangesMade'],
};

export const JOB_ANALYZER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    roleTitle: { type: Type.STRING },
    companyName: { type: Type.STRING },
    experienceYears: { type: Type.STRING },
    requiredSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    preferredSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    keyResponsibilities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    technicalStack: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    domainKnowledge: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    educationRequirements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    extractedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    summaryAssessment: {
      type: Type.STRING,
      description: 'Brief overview of this role and the ideal candidate profile.',
    },
  },
  required: [
    'roleTitle',
    'requiredSkills',
    'preferredSkills',
    'keyResponsibilities',
    'technicalStack',
    'domainKnowledge',
    'educationRequirements',
    'extractedKeywords',
    'summaryAssessment',
  ],
};

export function buildResumeAnalysisPrompt(resumeText: string, jobDescriptionText: string): string {
  return `You are a Principal Technical Recruiter, ATS Systems Architect, and Hiring Manager conducting a rigorous, evidence-based resume evaluation.

EVALUATION RULES & CORE PHILOSOPHY:
1. STRICT EVIDENCE MANDATE: You must NEVER invent, hallucinate, or assume experience, skills, degrees, metrics, or company names that are not explicitly documented in the resume.
2. If a skill is related but not listed, mark status as "missing" or "partial" and state "None found in resume" or cite the partial mention.
3. ZERO METRIC FABRICATION: When suggesting rewrites for weak bullets, DO NOT invent arbitrary percentages, dollar amounts, or numbers. Instead, use bracketed placeholders like "[reduced query latency by X%]" or "[supporting N concurrent users]" and prompt the candidate to fill in their real numbers.
4. EXPLAINABLE MATHEMATICAL SCORING: Calculate the individual component scores (0-100) carefully based on objective criteria:
   - ATS Compatibility (20% weight): Formatting safety, standard headings, clear contact info, date consistency, clean linear layout.
   - Job Relevance (25% weight): Alignment with target role responsibilities and domain experience.
   - Skills Match (20% weight): Concrete coverage of required vs preferred technical and soft competencies.
   - Experience Quality (15% weight): Depth, progression, leadership, task scope, and clarity.
   - Project Quality (10% weight): STAR methodology, technical complexity, and outcomes.
   - Content & Clarity (10% weight): Active verbs, concise wording, impact, grammar, zero buzzword fluff.
5. Provide actionable, high-signal recommendations. Avoid generic platitudes.
6. Provide tailored interview questions (Resume Deep Dives, Technical tests based on stated stack, Behavioral, Project Architectural deep-dives).

--- RESUME TEXT ---
${resumeText}

--- TARGET JOB DESCRIPTION ---
${jobDescriptionText || 'No specific job description provided. Perform a comprehensive general ATS, technical excellence, and industry-standard best-practices analysis for the candidate\'s apparent target domain.'}
`;
}

export function buildRewritePrompt(
  originalText: string,
  sectionType: string,
  style: string,
  jobContext?: string
): string {
  return `You are a specialized AI Resume Editor and Career Coach.

TASK:
Rewrite the provided resume excerpt into the requested style while adhering strictly to TRUTH-PRESERVING rules.

STYLE REQUESTED: ${style.toUpperCase()}
- 'concise': Trim all fluff and filler; high density of clear action verbs and clean technical terms.
- 'technical': Highlight architectural decisions, protocols, algorithms, frameworks, and system design specifics found in the original text.
- 'impact': Emphasize the problem solved, scope of ownership, and business/technical outcome. Use bracketed placeholders like [achieved X% improvement] if metrics are missing.
- 'ats': Ensure optimal standard keyword phrasing, high parsing clarity, and conventional formatting without keyword stuffing.

RULES:
1. NEVER invent technologies, frameworks, metrics, or companies not mentioned in the original text.
2. If the original lacks quantifiable results, preserve the factual work and insert a bracketed prompt like "[insert quantifiable metric here, e.g. latency, users, revenue]".
3. Provide a clear rationale explaining the improvements made.
4. List the key changes made in short bullet points.

--- SECTION TYPE ---
${sectionType || 'Bullet Point / Section'}

--- ORIGINAL TEXT ---
${originalText}

${jobContext ? `--- TARGET JOB CONTEXT ---\n${jobContext}` : ''}
`;
}

export const RESUME_ENHANCEMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    enhancedResumeMarkdown: {
      type: Type.STRING,
      description:
        'The complete, rewritten, fully optimized resume in clean markdown with standardized sections (# SUMMARY, # TECHNICAL SKILLS, # PROFESSIONAL EXPERIENCE, # PROJECTS, # EDUCATION).',
    },
    enhancedResumePlainText: {
      type: Type.STRING,
      description: 'The plain text version of the enhanced resume suitable for raw clipboard paste and ATS plain text boxes.',
    },
    projectedScores: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.NUMBER, description: 'Projected overall score (0-100) after enhancement.' },
        atsScore: { type: Type.NUMBER, description: 'Projected ATS score (0-100).' },
        skillsMatch: { type: Type.NUMBER, description: 'Projected skills match score (0-100).' },
        bulletImpact: { type: Type.NUMBER, description: 'Projected bullet impact rating (0-100).' },
        missingKeywordsCount: { type: Type.NUMBER, description: 'Number of remaining missing keywords after strategic placement.' },
      },
      required: ['overall', 'atsScore', 'skillsMatch', 'bulletImpact', 'missingKeywordsCount'],
    },
    sectionTransformations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sectionName: { type: Type.STRING },
          originalText: { type: Type.STRING },
          enhancedText: { type: Type.STRING },
          changesSummary: { type: Type.STRING },
          improvements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['sectionName', 'originalText', 'enhancedText', 'changesSummary', 'improvements'],
      },
    },
    bulletDiffs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          original: { type: Type.STRING },
          enhanced: { type: Type.STRING },
          rationale: { type: Type.STRING },
          keywordsAdded: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          metricsAdded: { type: Type.BOOLEAN },
        },
        required: ['section', 'original', 'enhanced', 'rationale', 'keywordsAdded', 'metricsAdded'],
      },
    },
    integratedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of target keywords naturally woven into experience and project descriptions.',
    },
    keyEnhancementsSummary: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Executive bullet points explaining major structural and qualitative enhancements.',
    },
    truthPreservationNotice: {
      type: Type.STRING,
      description: 'Affirmation of factual accuracy preserving genuine user experience while formatting for maximum impact.',
    },
  },
  required: [
    'enhancedResumeMarkdown',
    'enhancedResumePlainText',
    'projectedScores',
    'sectionTransformations',
    'bulletDiffs',
    'integratedKeywords',
    'keyEnhancementsSummary',
    'truthPreservationNotice',
  ],
};

export function buildResumeEnhancementPrompt(
  resumeText: string,
  jobDescriptionText: string,
  targetRole: string,
  style: string,
  analysisSummary?: string
): string {
  return `You are a Principal ATS Architect and Executive Resume Strategist.

TASK:
Perform a comprehensive, end-to-end rewrite and structural enhancement of the candidate's resume for the target role "${targetRole || 'Target Role'}".

ENHANCEMENT OBJECTIVES & STRATEGY:
1. MAXIMIZE ATS COMPATIBILITY (Target 95-100 ATS Score):
   - Standardize all section headers to canonical ATS formats (e.g., "PROFESSIONAL SUMMARY", "TECHNICAL SKILLS", "PROFESSIONAL EXPERIENCE", "KEY PROJECTS", "EDUCATION & CERTIFICATIONS").
   - Eliminate parsing risks, ambiguous date formats, weird character bullets, and multi-column clutter.
   - Format contact info cleanly on standard single lines.

2. STAR METHODOLOGY & QUANTIFIED BULLETS (Target 90-98 Bullet Impact):
   - Restructure every bullet into high-impact STAR (Situation/Task, Action, Result) format.
   - Begin with powerful, high-density action verbs (e.g., "Architected", "Spearheaded", "Engineered", "Orchestrated", "Optimized", "Refactored").
   - Add measurable business/technical outcomes. Where specific numbers were not provided in the original resume, insert smart bracketed placeholders like "[improved latency by X%]" or "[supporting N concurrent users / $Y scale]" so the user can easily plug in their verified numbers.

3. STRATEGIC KEYWORD INTEGRATION:
   - Naturally integrate key required and preferred skills from the job description into the professional summary, categorized skill matrix, and project/job descriptions.
   - NEVER engage in keyword stuffing or fake claims; integrate keywords in context of authentic responsibilities.

4. STYLE CONFIGURATION: "${style.toUpperCase()}"
   - 'impact_metrics': Heavy focus on quantifiable outcomes, scale, ROI, and measurable engineering/business gains.
   - 'ats_maximized': Cleanest canonical formatting, standard taxonomy, optimal keyword density and zero parsing friction.
   - 'technical_depth': Deep systems focus, architectural patterns, stack specifics, protocols, and technical ownership.
   - 'executive_leadership': Strategic vision, team enablement, cross-functional orchestration, velocity, and organizational impact.

5. TRUTH-PRESERVING INTEGRITY:
   - Preserve all real company names, degree titles, dates, and genuine work history.
   - Do NOT invent fake companies or degree institutions.

--- CURRENT RESUME TEXT ---
${resumeText}

--- TARGET JOB DESCRIPTION ---
${jobDescriptionText || 'General top-tier industry standard for ' + (targetRole || 'Software Engineering / Tech Professional')}

${analysisSummary ? `--- PREVIOUS ANALYSIS FINDINGS & GAPS ---\n${analysisSummary}` : ''}
`;
}
