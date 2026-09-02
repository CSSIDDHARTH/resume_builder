export type PriorityLevel = 'critical' | 'high' | 'medium' | 'optional';

export type MatchStatus = 'strong' | 'partial' | 'missing' | 'insufficient_evidence';
export type SkillMatchLevel = MatchStatus;

export interface ScoreDecomposition {
  overall: number; // 0 - 100
  atsCompatibility: number; // 20% weight
  jobRelevance: number; // 25% weight
  skillsMatch: number; // 20% weight
  experienceQuality: number; // 15% weight
  projectQuality: number; // 10% weight
  contentClarity: number; // 10% weight
  scoreExplanation: string;
}

export interface ATSFactor {
  factorName: string;
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0 - 100
  description: string;
  impact: string;
  recommendation: string;
}

export interface ATSCompatibilityAnalysis {
  score: number;
  overallSummary: string;
  factors: ATSFactor[];
  formattingScore: number;
  headingsScore: number;
  readabilityScore: number;
  contactInfoScore: number;
  dateConsistencyScore: number;
  parsingRisks: string[];
}

export interface SkillMatchItem {
  skill: string;
  category: string;
  status: MatchStatus;
  importance: 'required' | 'preferred';
  resumeEvidence: string; // Exact quote or evidence from resume, or 'None found'
  recommendedAction: string;
  recommendation?: string;
}

export interface KeywordAnalysis {
  importantJobKeywords: string[];
  presentInResume: string[];
  missingKeywords: string[];
  overusedKeywords: string[];
  naturalSuggestions: {
    keyword: string;
    contextRecommendation: string;
  }[];
  antiStuffingWarning: string;
}

export interface BulletPointEvaluation {
  id?: string;
  originalBullet: string;
  sectionTitle?: string;
  score: number;
  actionVerbStrength: 'strong' | 'average' | 'weak';
  quantifiableResultPresent: boolean;
  weakness: string;
  suggestedRewrite?: string;
}

export interface SectionAnalysis {
  sectionName: string;
  score: number; // 0 - 100
  present?: boolean;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ProjectAnalysis {
  projectName: string;
  technologiesUsed: string[];
  technicalComplexity: 'high' | 'medium' | 'low';
  userImpact: string;
  resultsReported: string;
  scalabilityNoted: boolean;
  originalityRating: 'high' | 'medium' | 'standard';
  demonstratesSTAR: boolean;
  improvementSuggestion: string;
  problemIdentified?: string;
}

export interface SuggestionItem {
  id?: string;
  priority: PriorityLevel;
  category: string;
  title: string;
  issue: string;
  whyItMatters: string;
  recommendation: string;
  concreteRecommendation?: string;
  sectionAffected: string;
  originalExample?: string;
  improvedExample?: string;
}

export interface InterviewQuestionItem {
  id?: string;
  category: 'resume_deep_dive' | 'technical' | 'behavioral' | 'project_deep_dive' | string;
  question: string;
  context: string;
  contextOrRationale?: string;
  keyTalkingPoints: string[];
  whatToAvoid: string;
}

export interface JobDescriptionDetails {
  roleTitle: string;
  companyName?: string;
  experienceYears?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keyResponsibilities: string[];
  technicalStack: string[];
  domainKnowledge: string[];
  educationRequirements: string[];
  extractedKeywords: string[];
}

export interface ResumeAnalysisResult {
  id: string;
  timestamp: string;
  resumeName: string;
  targetRole: string;
  targetCompany?: string;
  scores: ScoreDecomposition;
  atsAnalysis: ATSCompatibilityAnalysis;
  jobDetails?: JobDescriptionDetails;
  skillsMatch: SkillMatchItem[];
  keywordAnalysis: KeywordAnalysis;
  skillGaps?: any[];
  bulletPointEvaluations: BulletPointEvaluation[];
  bulletEvaluations?: BulletPointEvaluation[];
  sectionEvaluations: SectionAnalysis[];
  sectionAnalyses?: SectionAnalysis[];
  projectAnalyses?: ProjectAnalysis[];
  suggestions: SuggestionItem[];
  interviewQuestions: InterviewQuestionItem[];
  rawResumeTextSnippet?: string;
  rawJobDescriptionSnippet?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface SavedCloudReport {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  targetCompany?: string;
  overallScore: number;
  atsScore: number;
  analysisResult: ResumeAnalysisResult;
  createdAt: string;
  updatedAt?: string;
}

export interface SavedResume {
  id: string;
  title: string;
  targetRole?: string;
  textContent: string;
  fileName?: string;
  fileType?: 'pdf' | 'docx' | 'txt' | 'saved' | 'manual';
  createdAt?: string;
  updatedAt: string;
  tags?: string[];
  versionNote?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  resumeId?: string;
  resumeTitle: string;
  targetRole: string;
  targetCompany?: string;
  date: string;
  overallScore: number;
  matchScore: number;
  atsScore: number;
  criticalIssuesCount: number;
  result: ResumeAnalysisResult;
}

export type RewriteStyle = 'concise' | 'technical' | 'impact' | 'ats_optimized' | 'ats';

export type EnhancementStylePreset =
  | 'impact_metrics'
  | 'ats_maximized'
  | 'technical_depth'
  | 'executive_leadership';

export interface SectionTransformation {
  sectionName: string;
  originalText: string;
  enhancedText: string;
  changesSummary: string;
  improvements: string[];
}

export interface BulletDiffItem {
  id?: string;
  section?: string;
  original: string;
  enhanced: string;
  rationale: string;
  keywordsAdded: string[];
  metricsAdded: boolean;
}

export interface EnhancedResumeResult {
  id: string;
  timestamp: string;
  targetRole: string;
  targetCompany?: string;
  enhancementStyle: EnhancementStylePreset;
  originalResumeText: string;
  enhancedResumeMarkdown: string;
  enhancedResumePlainText: string;
  metricsComparison: {
    before: {
      overall: number;
      atsScore: number;
      skillsMatch: number;
      bulletImpact: number;
      missingKeywordsCount: number;
    };
    after: {
      overall: number;
      atsScore: number;
      skillsMatch: number;
      bulletImpact: number;
      missingKeywordsCount: number;
    };
    projectedGain: number;
  };
  sectionTransformations: SectionTransformation[];
  bulletDiffs: BulletDiffItem[];
  integratedKeywords: string[];
  keyEnhancementsSummary: string[];
  truthPreservationNotice: string;
}

export interface RewriteResponse {
  originalText: string;
  rewrittenText: string;
  style: RewriteStyle;
  explanation: string;
  keyImprovements: string[];
  missingMetricsPrompt?: string;
}
