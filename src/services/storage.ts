import { ResumeAnalysisResult, SavedResume, AnalysisHistoryItem } from '../types';
import { SAMPLE_RESUMES, DEMO_PRECOMPUTED_REPORT } from '../data/demoData';

const RESUMES_KEY = 'ai_resume_analyzer_resumes_v1';
const HISTORY_KEY = 'ai_resume_analyzer_history_v1';
const ACTIVE_ANALYSIS_KEY = 'ai_resume_analyzer_active_v1';
const SETTINGS_KEY = 'ai_resume_analyzer_settings_v1';

export interface AppSettings {
  atsStrictness: 'standard' | 'strict';
  theme: 'light';
  autoSaveHistory: boolean;
  clearUploadedFilesOnSessionEnd: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  atsStrictness: 'standard',
  theme: 'light',
  autoSaveHistory: true,
  clearUploadedFilesOnSessionEnd: false,
};

export function getStoredResumes(): SavedResume[] {
  try {
    const raw = localStorage.getItem(RESUMES_KEY);
    if (!raw) {
      // Seed with initial sample resumes
      localStorage.setItem(RESUMES_KEY, JSON.stringify(SAMPLE_RESUMES));
      return SAMPLE_RESUMES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load resumes from localStorage:', err);
    return SAMPLE_RESUMES;
  }
}

export function saveResume(resume: SavedResume): void {
  try {
    const existing = getStoredResumes();
    const index = existing.findIndex((r) => r.id === resume.id);
    let updated: SavedResume[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...resume, updatedAt: new Date().toISOString() };
    } else {
      updated = [resume, ...existing];
    }
    localStorage.setItem(RESUMES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save resume:', err);
  }
}

export function deleteResume(id: string): void {
  try {
    const existing = getStoredResumes();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete resume:', err);
  }
}

export function getAnalysisHistory(): AnalysisHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      // Seed with initial demo history item
      const initialHistory: AnalysisHistoryItem[] = [
        {
          id: DEMO_PRECOMPUTED_REPORT.id,
          resumeTitle: DEMO_PRECOMPUTED_REPORT.resumeName,
          targetRole: DEMO_PRECOMPUTED_REPORT.targetRole,
          targetCompany: DEMO_PRECOMPUTED_REPORT.targetCompany,
          date: DEMO_PRECOMPUTED_REPORT.timestamp,
          overallScore: DEMO_PRECOMPUTED_REPORT.scores.overall,
          matchScore: DEMO_PRECOMPUTED_REPORT.scores.skillsMatch,
          atsScore: DEMO_PRECOMPUTED_REPORT.scores.atsCompatibility,
          criticalIssuesCount: DEMO_PRECOMPUTED_REPORT.suggestions.filter((s) => s.priority === 'critical').length,
          result: DEMO_PRECOMPUTED_REPORT,
        },
      ];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(initialHistory));
      return initialHistory;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load analysis history:', err);
    return [];
  }
}

export function saveAnalysisToHistory(result: ResumeAnalysisResult, resumeId?: string): void {
  try {
    const history = getAnalysisHistory();
    const historyItem: AnalysisHistoryItem = {
      id: result.id,
      resumeId,
      resumeTitle: result.resumeName,
      targetRole: result.targetRole,
      targetCompany: result.targetCompany,
      date: result.timestamp,
      overallScore: result.scores.overall,
      matchScore: result.scores.skillsMatch,
      atsScore: result.scores.atsCompatibility,
      criticalIssuesCount: (result.suggestions || []).filter((s) => s.priority === 'critical').length,
      result,
    };

    const filtered = history.filter((h) => h.id !== result.id);
    const updated = [historyItem, ...filtered].slice(0, 50); // Store up to 50 runs
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save analysis to history:', err);
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getAnalysisHistory();
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete history item:', err);
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

export function getActiveAnalysis(): ResumeAnalysisResult | null {
  try {
    const raw = localStorage.getItem(ACTIVE_ANALYSIS_KEY);
    if (!raw) return DEMO_PRECOMPUTED_REPORT;
    return JSON.parse(raw);
  } catch {
    return DEMO_PRECOMPUTED_REPORT;
  }
}

export function setActiveAnalysis(result: ResumeAnalysisResult | null): void {
  try {
    if (result) {
      localStorage.setItem(ACTIVE_ANALYSIS_KEY, JSON.stringify(result));
    } else {
      localStorage.removeItem(ACTIVE_ANALYSIS_KEY);
    }
  } catch (err) {
    console.error('Failed to set active analysis:', err);
  }
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}
