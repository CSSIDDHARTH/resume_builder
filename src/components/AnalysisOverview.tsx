import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Copy,
  TrendingUp,
  Tag,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Cloud,
  Loader2,
  FileDown,
  Upload,
  Eye,
} from 'lucide-react';
import { ResumeAnalysisResult, AppUserProfile } from '../types';
import { NavTab } from './Sidebar';
import { User } from 'firebase/auth';
import { saveReportToFirestore, signInWithGoogle } from '../services/firestoreService';
import { DocumentViewerModal } from './DocumentViewerModal';

interface AnalysisOverviewProps {
  analysis: ResumeAnalysisResult;
  onNavigate: (tab: NavTab) => void;
  currentUser?: AppUserProfile | User | null;
  onSavedToCloud?: (reportId: string) => void;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  analysis,
  onNavigate,
  currentUser,
  onSavedToCloud,
}) => {
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'score' | 'ats' | 'keywords'>('score');
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);
  const [cloudSavedSuccess, setCloudSavedSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState<boolean>(false);

  const handleSaveToCloud = async () => {
    setIsSavingCloud(true);
    setSaveError(null);
    try {
      let uid = currentUser?.uid;
      if (!uid) {
        // Prompt sign in with Google
        const user = await signInWithGoogle();
        uid = user.uid;
      }
      const reportId = await saveReportToFirestore(uid, analysis);
      setCloudSavedSuccess(true);
      if (onSavedToCloud) onSavedToCloud(reportId);
      setTimeout(() => setCloudSavedSuccess(false), 4000);
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setSaveError(err.message || 'Failed to save report to cloud');
      }
    } finally {
      setIsSavingCloud(false);
    }
  };

  const {
    scores,
    atsAnalysis,
    keywordAnalysis,
    targetRole,
    targetCompany,
    resumeName,
    timestamp,
  } = analysis;

  const handleCopySummary = () => {
    const summary = `Resume Analysis Report for ${resumeName}
Target Role: ${targetRole} ${targetCompany ? `at ${targetCompany}` : ''}
Overall Score: ${scores.overall}/100
- ATS Compatibility: ${scores.atsCompatibility}/100
- Job Relevance: ${scores.jobRelevance}/100
- Skills Match: ${scores.skillsMatch}/100
- Experience Quality: ${scores.experienceQuality}/100
- Project Quality: ${scores.projectQuality}/100
- Content Clarity: ${scores.contentClarity}/100

Explanation: ${scores.scoreExplanation}`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleExportMarkdown = () => {
    const md = `# Resume Intelligence Report: ${resumeName}
**Target Role:** ${targetRole} ${targetCompany ? `(${targetCompany})` : ''}  
**Date:** ${new Date(timestamp).toLocaleDateString()}  
**Overall Score:** ${scores.overall} / 100  

---

## 1. Score Decomposition
- **ATS Compatibility (20%):** ${scores.atsCompatibility} / 100
- **Job Relevance (25%):** ${scores.jobRelevance} / 100
- **Skills Match (20%):** ${scores.skillsMatch} / 100
- **Experience Quality (15%):** ${scores.experienceQuality} / 100
- **Project Quality (10%):** ${scores.projectQuality} / 100
- **Content & Clarity (10%):** ${scores.contentClarity} / 100

**Scoring Rationale:**
${scores.scoreExplanation}

---

## 2. ATS Compatibility Audit (${atsAnalysis?.score ?? 0} / 100)
${atsAnalysis?.overallSummary || 'ATS analysis summary.'}

### Evaluated Factors:
${(atsAnalysis?.factors || [])
  .map(
    (f) => `
#### ${f.factorName} [${(f.status || 'warning').toUpperCase()} - ${f.score ?? 0}/100]
- **Description:** ${f.description || ''}
- **Impact:** ${f.impact || ''}
- **Recommendation:** ${f.recommendation || ''}
`
  )
  .join('\n')}

---

## 3. Keyword Analysis
- **Important Job Keywords:** ${(keywordAnalysis?.importantJobKeywords || []).join(', ') || 'None'}
- **Found in Resume:** ${(keywordAnalysis?.presentInResume || []).join(', ') || 'None'}
- **Missing Keywords:** ${(keywordAnalysis?.missingKeywords || []).join(', ') || 'None'}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${resumeName.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    const reportText = `RESUMESENSE PRO ANALYSIS REPORT
Target Role: ${targetRole} ${targetCompany ? `(${targetCompany})` : ''}
Candidate: ${resumeName}
Overall Match Score: ${scores.overall}/100
ATS Compatibility: ${scores.atsCompatibility}/100
Key Skills Match: ${scores.skillsMatch}/100
Generated: ${new Date(timestamp).toLocaleString()}

--- SCORES DECOMPOSITION ---
Job Relevance: ${scores.jobRelevance}/100
Experience Quality: ${scores.experienceQuality}/100
Project Depth: ${scores.projectQuality}/100
Content Clarity: ${scores.contentClarity}/100

--- ATS SUMMARY ---
${atsAnalysis.overallSummary}

--- MISSING KEYWORDS ---
${(keywordAnalysis?.missingKeywords || []).join(', ') || 'None identified'}
`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${resumeName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
              Evaluation Report
            </span>
            <span className="text-xs text-slate-400">
              Analyzed {new Date(timestamp).toLocaleDateString()}
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900">
            Overall Score & ATS Compatibility Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Candidate: <strong className="text-slate-800">{resumeName}</strong> • Target:{' '}
            <strong className="text-slate-800">{targetRole}</strong>{' '}
            {targetCompany ? `(${targetCompany})` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveToCloud}
            disabled={isSavingCloud}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold cursor-pointer transition-all shadow-xs ${
              cloudSavedSuccess
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title="Save this analysis report to Firestore Cloud Database"
          >
            {isSavingCloud ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : cloudSavedSuccess ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Cloud className="h-3.5 w-3.5" />
            )}
            <span>
              {isSavingCloud
                ? 'Saving...'
                : cloudSavedSuccess
                ? 'Saved to Cloud'
                : 'Save to Cloud'}
            </span>
          </button>

          <button
            onClick={() => onNavigate('enhance-diff')}
            className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:from-indigo-700 hover:to-blue-700 shadow-xs cursor-pointer transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Enhance</span>
          </button>

          <button
            onClick={() => setIsViewerModalOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
            title="Inspect original resume document"
          >
            <Eye className="h-3.5 w-3.5 text-blue-600" />
            <span>View Document</span>
          </button>

          <button
            onClick={handleExportText}
            className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
            title="Download Plain Text Summary"
          >
            <FileDown className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Text</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 shadow-xs cursor-pointer transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Markdown</span>
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* AI One-Click Enhancement Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white border border-indigo-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                New Feature • Powered by Gemini 3.7 Flash
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                Projected +15-25 Pts
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Transform this Resume with AI & Compare Before vs. After
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Instantly rewrite weak bullet points into high-impact STAR achievements, standardize section headings for 98+ ATS compatibility, and weave missing target keywords.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('enhance-diff')}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Enhance with AI & View Diff</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* High Density Sub-tab Switcher */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveSubTab('score')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeSubTab === 'score'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Score Decomposition
        </button>
        <button
          onClick={() => setActiveSubTab('ats')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeSubTab === 'ats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          ATS Parsing Compatibility ({atsAnalysis.score}/100)
        </button>
        <button
          onClick={() => setActiveSubTab('keywords')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeSubTab === 'keywords'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Keyword & Density Audit
        </button>
      </div>

      {/* SUB-TAB 1: SCORE DECOMPOSITION */}
      {activeSubTab === 'score' && (
        <div className="space-y-6">
          {/* Main Hero Score Gauge Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Overall Weighted Match
                </span>
                <div className="mt-2 flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-5xl font-black text-blue-600">{scores.overall}</span>
                  <span className="text-lg font-bold text-slate-400">/ 100</span>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                      scores.overall >= 80
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {scores.overall >= 80 ? 'Highly Competitive' : 'Action Needed'}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Scoring Rationale & Summary
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-mono">
                  {scores.scoreExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* 6 Dimension Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Job Relevance</span>
                  <span className="text-blue-600 font-bold">{scores.jobRelevance}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${scores.jobRelevance}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Alignment between role requirements and past responsibilities.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Skills Match</span>
                  <span className="text-blue-600 font-bold">{scores.skillsMatch}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${scores.skillsMatch}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Coverage of hard and soft technical skills requested in job post.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Experience Quality</span>
                  <span className="text-blue-600 font-bold">
                    {scores.experienceQuality}/100
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${scores.experienceQuality}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Action verbs, measurable metrics, and STAR structure depth.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Project Quality</span>
                  <span className="text-blue-600 font-bold">{scores.projectQuality}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${scores.projectQuality}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Architecture complexity and real-world system impact in projects.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Content Clarity</span>
                  <span className="text-blue-600 font-bold">{scores.contentClarity}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${scores.contentClarity}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Conciseness, flow, readability, and freedom from fluff phrases.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>ATS Compatibility</span>
                  <span className="text-emerald-600 font-bold">
                    {scores.atsCompatibility}/100
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${scores.atsCompatibility}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Standard headings, parsable typography, and single-column layout.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ATS PARSING AUDIT */}
      {activeSubTab === 'ats' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Automated Parsing Health
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-0.5">
                  ATS Scanner Compliance Summary
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {atsAnalysis.score}
                </span>
                <span className="text-sm text-slate-400 font-bold">/ 100</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-4">
              {atsAnalysis.overallSummary}
            </p>
          </div>

          {/* ATS Factors Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(atsAnalysis?.factors || []).map((factor, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {factor.factorName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        factor.status === 'pass'
                          ? 'bg-emerald-100 text-emerald-700'
                          : factor.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {(factor.status || 'warning').toUpperCase()} ({factor.score ?? 0}/100)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2">{factor.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Recommendation: </strong>
                  {factor.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KEYWORD & DENSITY AUDIT */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Present in Resume */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Present in Resume
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {(keywordAnalysis?.presentInResume || []).length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(keywordAnalysis?.presentInResume || []).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Missing Keywords
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {(keywordAnalysis?.missingKeywords || []).length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(keywordAnalysis?.missingKeywords || []).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono font-medium bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Job Keywords Target */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Important Target Keywords
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {(keywordAnalysis?.importantJobKeywords || []).length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(keywordAnalysis?.importantJobKeywords || []).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
        file={null}
        fileUrl={null}
        extractedText={analysis.rawResumeTextSnippet || 'No raw text snippet available for this report.'}
        fileName={analysis.resumeName || 'Resume Document'}
        detectedSections={analysis.sectionAnalyses?.map((s) => s.sectionName) || []}
        fileType="Resume Document"
      />
    </div>
  );
};
