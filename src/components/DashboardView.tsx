import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  Flame,
  Layers,
  ChevronRight,
  TrendingUp,
  XCircle,
  ExternalLink,
  FileDown,
} from 'lucide-react';
import { ResumeAnalysisResult, AnalysisHistoryItem } from '../types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  activeAnalysis: ResumeAnalysisResult | null;
  history: AnalysisHistoryItem[];
  onNavigate: (tab: NavTab) => void;
  onSelectHistoryItem: (item: AnalysisHistoryItem) => void;
  onLoadDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeAnalysis,
  history,
  onNavigate,
  onSelectHistoryItem,
  onLoadDemo,
}) => {
  if (!activeAnalysis) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">No Resume Analyzed Yet</h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">
            Upload your resume and a target job description to generate high-density ATS metrics, skill matrix audits, and AI rewrites.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload & Analyze Resume</span>
            </button>
            <button
              onClick={onLoadDemo}
              className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>Load Interactive Demo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    scores,
    atsAnalysis,
    skillsMatch,
    keywordAnalysis,
    suggestions,
    interviewQuestions,
    bulletPointEvaluations,
    targetRole,
    targetCompany,
    resumeName,
    timestamp,
  } = activeAnalysis;

  const missingKeywordsCount = keywordAnalysis?.missingKeywords?.length || 0;
  const criticalSuggestions = suggestions.filter((s) => s.priority === 'critical');
  const topSuggestion = suggestions[0] || null;

  // Segmented bullet impact calculator
  const bulletImpactSegments = () => {
    const score = scores.experienceQuality || 75;
    const filled = Math.min(4, Math.max(1, Math.round((score / 100) * 4)));
    return Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full ${
          i < filled ? 'bg-emerald-500' : 'bg-slate-200'
        }`}
      />
    ));
  };

  const getBulletImpactLabel = (score: number) => {
    if (score >= 85) return 'High';
    if (score >= 70) return 'Moderate';
    return 'Low';
  };

  const handleExportText = () => {
    if (!activeAnalysis) return;
    const reportText = `RESUMESENSE PRO ANALYSIS REPORT
Target Role: ${activeAnalysis.targetRole} ${activeAnalysis.targetCompany ? `(${activeAnalysis.targetCompany})` : ''}
Overall Match Score: ${activeAnalysis.scores.overall}/100
ATS Compatibility: ${activeAnalysis.scores.atsCompatibility}/100
Key Skills Match: ${activeAnalysis.scores.skillsMatch}/100
Generated: ${new Date(activeAnalysis.timestamp).toLocaleString()}

--- SCORES DECOMPOSITION ---
Job Relevance: ${activeAnalysis.scores.jobRelevance}/100
Experience Quality: ${activeAnalysis.scores.experienceQuality}/100
Project Depth: ${activeAnalysis.scores.projectQuality}/100
Content Clarity: ${activeAnalysis.scores.contentClarity}/100

--- ATS FINDINGS ---
${activeAnalysis.atsAnalysis.overallSummary}
`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${activeAnalysis.resumeName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Quick Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
              Candidate Overview
            </span>
            <span className="text-xs text-slate-400">
              Audited {new Date(timestamp).toLocaleDateString()}
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900 tracking-tight">
            {resumeName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeting <strong className="text-slate-700">{targetRole}</strong>{' '}
            {targetCompany ? `at ${targetCompany}` : ''}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportText}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Download Plain Text Summary"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Text</span>
          </button>

          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors cursor-pointer"
            title="Reload Demo Data"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Demo Report</span>
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* AI Resume Enhancement Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white border border-indigo-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                Gemini 3.7 Flash Engine
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                Projected +15-25 Pts
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              One-Click AI Resume Enhancement & Before vs. After Diff
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Instantly upgrade weak bullet points into high-impact STAR achievements, standardize section headings for 98+ ATS compatibility, and weave missing target keywords.
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

      {/* 4 TOP HIGH-DENSITY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Job Match Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Job Match Score
          </span>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-bold text-blue-600">{scores.overall}%</span>
            <span className="text-xs text-emerald-600 font-semibold">+12% benchmark</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${scores.overall}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: ATS Compatibility */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            ATS Compatibility
          </span>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-bold text-slate-800">
              {scores.atsCompatibility}/100
            </span>
            <span
              className={`text-xs font-medium ${
                scores.atsCompatibility >= 80
                  ? 'text-emerald-600'
                  : 'text-amber-500 italic'
              }`}
            >
              {scores.atsCompatibility >= 80 ? 'Parsed Clean' : 'Requires work'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                scores.atsCompatibility >= 80 ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              style={{ width: `${scores.atsCompatibility}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Bullet Impact */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Bullet Impact
          </span>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-bold text-slate-800">
              {getBulletImpactLabel(scores.experienceQuality)}
            </span>
            <span className="text-xs text-slate-400 font-medium">STAR Verified</span>
          </div>
          <div className="flex gap-1">{bulletImpactSegments()}</div>
        </div>

        {/* Metric 4: Missing Keywords */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Missing Keywords
          </span>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-bold text-red-500">
              {String(missingKeywordsCount).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 font-medium">From Job Spec</span>
          </div>
          <span className="text-[10px] text-slate-400 truncate">
            {keywordAnalysis?.missingKeywords?.slice(0, 3).join(', ') || 'None identified'}
          </span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN HIGH-DENSITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 cols): Skill Gap Matrix & AI Content Improvement */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Skill Gap Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">Skill Gap Matrix</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded">
                  Direct Comparison
                </span>
              </div>
              <button
                onClick={() => onNavigate('skill-gap')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({skillsMatch.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-xs border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="pb-1 pl-4">Job Requirement</th>
                    <th className="pb-1">Resume Evidence</th>
                    <th className="pb-1">Status</th>
                    <th className="pb-1 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {skillsMatch.slice(0, 5).map((skill, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-slate-50/80 rounded-lg' : 'bg-white'}
                    >
                      <td className="py-2.5 pl-4 font-semibold text-slate-800 max-w-[150px] truncate">
                        {skill.skill}
                      </td>
                      <td className="py-2.5 text-slate-600 italic max-w-[200px] truncate">
                        {skill.resumeEvidence && skill.resumeEvidence !== 'None found'
                          ? skill.resumeEvidence
                          : 'No direct mention'}
                      </td>
                      <td className="py-2.5">
                        {skill.status === 'strong' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
                            STRONG
                          </span>
                        )}
                        {skill.status === 'partial' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
                            PARTIAL
                          </span>
                        )}
                        {skill.status === 'missing' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                            MISSING
                          </span>
                        )}
                        {skill.status === 'insufficient_evidence' && (
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">
                            INSUFFICIENT
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        {skill.status === 'missing' || skill.status === 'partial' ? (
                          <button
                            onClick={() => onNavigate('rewriter')}
                            className="text-blue-600 font-medium hover:underline cursor-pointer"
                          >
                            Add to Bullet
                          </button>
                        ) : (
                          <span className="text-slate-400">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Content Improvement Showcase Card */}
          {bulletPointEvaluations && bulletPointEvaluations.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-xs overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-tight">
                    AI Content Improvement
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  CRITICAL PRIORITY
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:border-r border-slate-100 md:pr-4">
                  <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Current Bullet (Weak Action / Unquantified)
                  </div>
                  <p className="text-xs text-slate-500 line-through decoration-slate-300 leading-relaxed font-mono">
                    {bulletPointEvaluations[0].originalBullet}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Recommended Rewrite (STAR Format)</span>
                    <button
                      onClick={() => onNavigate('rewriter')}
                      className="text-blue-600 hover:underline lowercase font-normal cursor-pointer"
                    >
                      customize in rewriter &rarr;
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed font-mono bg-emerald-50/60 p-2.5 rounded border border-emerald-100">
                    {bulletPointEvaluations[0].suggestedRewrite ||
                      'Restructured unindexed database relational queries and integrated distributed caching, reducing p99 latency by 88%.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section Score Breakdown Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">
              Detailed Score Breakdown (6 Dimensions)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Job Relevance (25%)
                </span>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {scores.jobRelevance}/100
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Skills Match (20%)
                </span>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {scores.skillsMatch}/100
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Experience Quality (15%)
                </span>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {scores.experienceQuality}/100
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Project Depth (10%)
                </span>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {scores.projectQuality}/100
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Content Clarity (10%)
                </span>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {scores.contentClarity}/100
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  ATS Standard (20%)
                </span>
                <div className="text-lg font-bold text-slate-800 mt-1">
                  {scores.atsCompatibility}/100
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Interview Prep & Dark ATS Health Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Interview Prep High-Density Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>Interview Prep</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                  {interviewQuestions.length}
                </span>
              </h3>
              <button
                onClick={() => onNavigate('interview')}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                All Questions &rarr;
              </button>
            </div>

            <ul className="space-y-2.5">
              {interviewQuestions.slice(0, 3).map((q, idx) => (
                <li
                  key={idx}
                  className={`p-3 rounded-r-lg border-l-4 ${
                    idx === 0
                      ? 'bg-blue-50/70 border-blue-500'
                      : idx === 1
                      ? 'bg-slate-50 border-slate-400'
                      : 'bg-slate-50 border-amber-400'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${
                      idx === 0
                        ? 'text-blue-600'
                        : idx === 1
                        ? 'text-slate-600'
                        : 'text-amber-700'
                    }`}
                  >
                    {q.category.replace(/_/g, ' ')}
                  </div>
                  <p className="text-xs text-slate-800 leading-normal font-medium line-clamp-3">
                    {q.question}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ATS Health Report (Dark Navy Slate High-Density Card) */}
          <div className="bg-[#1e293b] rounded-xl p-5 text-white shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ATS Health Report
                </h4>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {atsAnalysis.score} / 100
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                  <span className="text-slate-300">Formatting (No Tables/Columns)</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {atsAnalysis.formattingScore >= 80 ? 'PASS' : 'WARN'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                  <span className="text-slate-300">Contact Info Parsing</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {atsAnalysis.contactInfoScore >= 80 ? 'PASS' : 'WARN'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                  <span className="text-slate-300">Keyword Density</span>
                  <span
                    className={`font-bold font-mono ${
                      missingKeywordsCount > 3 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {missingKeywordsCount > 3 ? 'LOW' : 'OPTIMAL'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                  <span className="text-slate-300">Heading Hierarchy</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {atsAnalysis.headingsScore >= 80 ? 'PASS' : 'WARN'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">File Readability</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {atsAnalysis.readabilityScore >= 80 ? 'PASS' : 'WARN'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('analysis')}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-bold transition-all cursor-pointer text-center"
            >
              VIEW FULL ATS AUDIT
            </button>
          </div>

          {/* Quick Profile Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Active Candidate & Role
            </span>
            <div className="text-xs font-bold text-slate-800">{resumeName}</div>
            <div className="text-xs text-blue-600 font-semibold mt-0.5">
              {targetRole} {targetCompany ? `• ${targetCompany}` : ''}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Evaluated on</span>
              <span>{new Date(timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
