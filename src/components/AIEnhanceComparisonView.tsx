import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Layers,
  FileText,
  ShieldCheck,
  Sliders,
  TrendingUp,
  Tag,
  Eye,
  Columns,
  ListFilter,
  Award,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  BookmarkCheck,
} from 'lucide-react';
import {
  EnhancedResumeResult,
  EnhancementStylePreset,
  ResumeAnalysisResult,
  SavedResume,
} from '../types';
import { enhanceFullResume } from '../services/api';

interface AIEnhanceComparisonViewProps {
  activeAnalysis: ResumeAnalysisResult | null;
  enhancedResult: EnhancedResumeResult | null;
  onUpdateEnhancedResult: (result: EnhancedResumeResult) => void;
  onReAnalyze: (enhancedText: string) => void;
  onSaveProfile: (profile: SavedResume) => void;
  onNavigateToUpload: () => void;
}

export const AIEnhanceComparisonView: React.FC<AIEnhanceComparisonViewProps> = ({
  activeAnalysis,
  enhancedResult,
  onUpdateEnhancedResult,
  onReAnalyze,
  onSaveProfile,
  onNavigateToUpload,
}) => {
  const [selectedStyle, setSelectedStyle] =
    useState<EnhancementStylePreset>('impact_metrics');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'split' | 'bullets' | 'sections' | 'full'>(
    'split'
  );
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [bulletFilter, setBulletFilter] = useState<'all' | 'metrics' | 'keywords'>('all');

  const originalText =
    activeAnalysis?.rawResumeTextSnippet ||
    enhancedResult?.originalResumeText ||
    '';
  const jobText = activeAnalysis?.rawJobDescriptionSnippet || '';

  const handleRunEnhancement = async (styleToUse?: EnhancementStylePreset) => {
    if (!originalText || originalText.length < 20) {
      setErrorMessage('No resume text available to enhance. Please upload or analyze a resume first.');
      return;
    }

    const targetStyle = styleToUse || selectedStyle;
    setIsEnhancing(true);
    setErrorMessage(null);

    try {
      const result = await enhanceFullResume({
        resumeText: originalText,
        jobDescription: jobText,
        targetRole: activeAnalysis?.targetRole || enhancedResult?.targetRole || 'Target Role',
        targetCompany: activeAnalysis?.targetCompany || enhancedResult?.targetCompany,
        style: targetStyle,
        analysisContext: activeAnalysis
          ? `Overall score: ${activeAnalysis.scores.overall}. ATS findings: ${activeAnalysis.atsAnalysis.overallSummary}. Missing keywords: ${activeAnalysis.keywordAnalysis.missingKeywords.join(', ')}`
          : undefined,
        currentScores: activeAnalysis
          ? {
              overall: activeAnalysis.scores.overall,
              atsCompatibility: activeAnalysis.scores.atsCompatibility,
              skillsMatch: activeAnalysis.scores.skillsMatch,
              experienceQuality: activeAnalysis.scores.experienceQuality,
              missingKeywordsCount: activeAnalysis.keywordAnalysis.missingKeywords.length,
            }
          : undefined,
      });

      onUpdateEnhancedResult(result);
    } catch (err: any) {
      console.error('Enhancement error:', err);
      setErrorMessage(err.message || 'Failed to enhance resume. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(identifier);
    setTimeout(() => setCopiedSection(null), 2200);
  };

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToProfiles = () => {
    if (!enhancedResult) return;
    const newProfile: SavedResume = {
      id: 'saved-' + Date.now(),
      title: `${enhancedResult.targetRole} (AI Enhanced - ${new Date().toLocaleDateString()})`,
      targetRole: enhancedResult.targetRole,
      textContent: enhancedResult.enhancedResumePlainText || enhancedResult.enhancedResumeMarkdown,
      fileType: 'saved',
      updatedAt: new Date().toISOString(),
      tags: ['AI Enhanced', enhancedResult.enhancementStyle, 'STAR Optimized'],
      versionNote: `Enhanced with Gemini 3.7 Flash (${enhancedResult.enhancementStyle})`,
    };
    onSaveProfile(newProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!enhancedResult && !activeAnalysis) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Resume Loaded</h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Upload or analyze a resume first to unlock one-click AI enhancement and interactive Before vs. After comparison.
        </p>
        <button
          onClick={onNavigateToUpload}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Upload Resume & Start Audit</span>
        </button>
      </div>
    );
  }

  // If we have an active analysis but no enhanced result yet, show the prompt to trigger it
  if (!enhancedResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-2xl p-8 text-white shadow-md border border-indigo-500/20">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
              Gemini 3.7 Flash Engine
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            One-Click AI Resume Enhancement
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed mb-8">
            Automatically transform your resume into an elite, ATS-optimized document: upgrades all bullet points to quantifiable STAR metrics, standardizes section hierarchies for 98+ ATS compatibility, and strategically weaves missing target keywords while strictly preserving genuine career facts.
          </p>

          <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl p-5 mb-8">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Choose Enhancement Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'impact_metrics',
                  title: 'STAR & High Impact',
                  desc: 'Heavy focus on quantified metrics, scale, and business ROI.',
                },
                {
                  id: 'ats_maximized',
                  title: 'ATS Maximized',
                  desc: 'Canonical formatting, zero parsing friction, and target keyword density.',
                },
                {
                  id: 'technical_depth',
                  title: 'Technical Depth',
                  desc: 'Architectural patterns, protocols, stack specifics, and systems mastery.',
                },
                {
                  id: 'executive_leadership',
                  title: 'Executive Leadership',
                  desc: 'Strategic direction, team enablement, velocity, and cross-functional impact.',
                },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id as EnhancementStylePreset)}
                  className={`p-3.5 rounded-lg text-left border transition-all cursor-pointer ${
                    selectedStyle === style.id
                      ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-xs'
                      : 'bg-slate-900/50 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center justify-between">
                    <span>{style.title}</span>
                    {selectedStyle === style.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs mb-6">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleRunEnhancement()}
              disabled={isEnhancing}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enhancing Resume with Gemini 3.7 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Enhancement & Comparison</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    metricsComparison,
    sectionTransformations,
    bulletDiffs,
    integratedKeywords,
    keyEnhancementsSummary,
    enhancedResumeMarkdown,
    enhancedResumePlainText,
    truthPreservationNotice,
    enhancementStyle,
  } = enhancedResult;

  const filteredBullets = bulletDiffs.filter((b) => {
    if (bulletFilter === 'metrics') return b.metricsAdded;
    if (bulletFilter === 'keywords') return b.keywordsAdded.length > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Enhanced with Gemini 3.7 Flash
              </span>
              <span className="text-xs text-slate-500 capitalize">
                Style: <strong className="text-slate-800">{enhancementStyle.replace('_', ' ')}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Resume Enhancement & Before vs. After Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Compare your original resume against the AI-engineered STAR version. Review bullet diffs, section transformations, and projected score gains.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleRunEnhancement()}
              disabled={isEnhancing}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Regenerate with current or different style"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : 'Regenerate'}</span>
            </button>

            <button
              onClick={() => onReAnalyze(enhancedResumePlainText || enhancedResumeMarkdown)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Run full ATS audit on this enhanced resume"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Run Full Audit on Enhanced</span>
            </button>

            <button
              onClick={handleSaveToProfiles}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Profiles!</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Save to Profiles</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Style Selector Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Enhancement Style:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'impact_metrics', label: 'STAR Impact' },
                { id: 'ats_maximized', label: 'ATS Maximized' },
                { id: 'technical_depth', label: 'Technical Depth' },
                { id: 'executive_leadership', label: 'Executive' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setSelectedStyle(style.id as EnhancementStylePreset);
                    handleRunEnhancement(style.id as EnhancementStylePreset);
                  }}
                  disabled={isEnhancing}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    enhancementStyle === style.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyText(enhancedResumePlainText || enhancedResumeMarkdown, 'all-plain')}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedSection === 'all-plain' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'all-plain' ? 'Copied Plain Text!' : 'Copy Plain Text'}</span>
            </button>

            <button
              onClick={() =>
                handleDownloadFile(
                  enhancedResumeMarkdown,
                  `enhanced-resume-${enhancedResult.targetRole.toLowerCase().replace(/\s+/g, '-')}.md`,
                  'text/markdown'
                )
              }
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Scorecard Strip: Before vs. After */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Overall Score
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-400 line-through">
              {metricsComparison.before.overall}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-2xl font-black text-indigo-600">
              {metricsComparison.after.overall}
            </span>
            <span className="ml-auto text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              +{metricsComparison.after.overall - metricsComparison.before.overall} pts
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Comprehensive holistic rating</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            ATS Compatibility
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-400 line-through">
              {metricsComparison.before.atsScore}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-2xl font-black text-emerald-600">
              {metricsComparison.after.atsScore}
            </span>
            <span className="ml-auto text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              +{metricsComparison.after.atsScore - metricsComparison.before.atsScore} pts
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">0 parsing errors & standard headers</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Skills Alignment
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-400 line-through">
              {metricsComparison.before.skillsMatch}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-2xl font-black text-blue-600">
              {metricsComparison.after.skillsMatch}
            </span>
            <span className="ml-auto text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              +{metricsComparison.after.skillsMatch - metricsComparison.before.skillsMatch} pts
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Natural keyword coverage</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Bullet Point Impact
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-400 line-through">
              {metricsComparison.before.bulletImpact}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-2xl font-black text-purple-600">
              {metricsComparison.after.bulletImpact}
            </span>
            <span className="ml-auto text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              +{metricsComparison.after.bulletImpact - metricsComparison.before.bulletImpact} pts
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">STAR structure & metrics</div>
        </div>
      </div>

      {/* Strategic Transformations Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-xs border border-indigo-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Key Strategic Improvements Applied
            </h3>
          </div>
          <span className="text-[11px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/30">
            Fact-Preserving Guarantee
          </span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300 mb-4">
          {keyEnhancementsSummary.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Integrated Keywords Pills */}
        {integratedKeywords && integratedKeywords.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Strategically Woven Keywords:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {integratedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Mode Switcher Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="border-b border-slate-200 px-4 pt-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'split'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side Visual Diff</span>
            </button>

            <button
              onClick={() => setActiveTab('bullets')}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bullets'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>STAR Bullet Upgrades ({bulletDiffs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sections'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Section Transformations ({sectionTransformations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('full')}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'full'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Complete Markdown Document</span>
            </button>
          </div>

          {activeTab === 'bullets' && (
            <div className="flex items-center gap-1.5 pb-2">
              <span className="text-[11px] text-slate-500 font-medium">Filter:</span>
              <button
                onClick={() => setBulletFilter('all')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                  bulletFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-200/80 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({bulletDiffs.length})
              </button>
              <button
                onClick={() => setBulletFilter('metrics')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                  bulletFilter === 'metrics'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-200/80 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Metrics Added
              </button>
              <button
                onClick={() => setBulletFilter('keywords')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                  bulletFilter === 'keywords'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-200/80 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Keywords Added
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Side-by-Side Visual Diff */}
        {activeTab === 'split' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Original Resume */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Original Submitted Resume
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    Score: {metricsComparison.before.overall}/100
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-700 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap select-text">
                  {originalText}
                </div>
              </div>

              {/* Right Column: AI Enhanced Version */}
              <div className="border border-indigo-200 rounded-xl p-5 bg-indigo-50/30 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI Enhanced STAR Resume
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      Score: {metricsComparison.after.overall}/100 (+
                      {metricsComparison.after.overall - metricsComparison.before.overall})
                    </span>
                    <button
                      onClick={() => handleCopyText(enhancedResumeMarkdown, 'diff-right')}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'diff-right' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-indigo-200 rounded-lg p-4 font-mono text-xs text-slate-800 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap select-text shadow-2xs">
                  {enhancedResumeMarkdown}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bullet-by-Bullet STAR Upgrade Matrix */}
        {activeTab === 'bullets' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-slate-600 mb-2">
              Every weak or passive responsibility bullet point has been transformed into an action-oriented STAR statement with measurable scale benchmarks.
            </div>

            <div className="space-y-3">
              {filteredBullets.map((diff, index) => (
                <div
                  key={diff.id || index}
                  className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {diff.section || 'Work Experience'} #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {diff.metricsAdded && (
                        <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Metrics Added
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyText(diff.enhanced, `bullet-${index}`)}
                        className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === `bullet-${index}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy Bullet</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {/* Before */}
                    <div className="p-3 bg-red-50/40 border border-red-200/70 rounded-lg">
                      <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">
                        Before (Weak / Passive)
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{diff.original}</p>
                    </div>

                    {/* After */}
                    <div className="p-3 bg-emerald-50/40 border border-emerald-200/80 rounded-lg">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>After (High-Impact STAR)</span>
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-900 leading-relaxed">
                        {diff.enhanced}
                      </p>
                    </div>
                  </div>

                  {/* Rationale & Keyword Tags */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-slate-600 text-[11px]">
                      <strong>Rationale:</strong> {diff.rationale}
                    </div>

                    {diff.keywordsAdded.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-medium">Keywords Added:</span>
                        {diff.keywordsAdded.map((k, kidx) => (
                          <span
                            key={kidx}
                            className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                          >
                            +{k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Section Transformations */}
        {activeTab === 'sections' && (
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              {sectionTransformations.map((sec, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {sec.sectionName}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {sec.changesSummary}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Original Section Excerpt
                      </div>
                      <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {sec.originalText}
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50/40 border border-indigo-200 rounded-lg">
                      <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Enhanced Section</span>
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                      </div>
                      <p className="text-xs text-slate-900 whitespace-pre-wrap leading-relaxed font-medium">
                        {sec.enhancedText}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-600 mb-1.5">
                      Key Upgrades in this Section:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sec.improvements.map((imp, impIdx) => (
                        <span
                          key={impIdx}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          {imp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Full Markdown Document */}
        {activeTab === 'full' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-slate-600">
                Full enhanced resume in standardized Markdown format. Ready for direct export or profile saving.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(enhancedResumeMarkdown, 'full-md')}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSection === 'full-md' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'full-md' ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
                <button
                  onClick={() =>
                    handleDownloadFile(
                      enhancedResumeMarkdown,
                      `enhanced-${enhancedResult.targetRole.toLowerCase().replace(/\s+/g, '-')}.md`,
                      'text/markdown'
                    )
                  }
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-xs leading-relaxed max-h-[700px] overflow-y-auto whitespace-pre-wrap select-text border border-slate-800 shadow-inner">
              {enhancedResumeMarkdown}
            </div>
          </div>
        )}
      </div>

      {/* Truth Preservation Notice Footer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Factual Integrity Assurance: </strong>
          {truthPreservationNotice}
        </div>
      </div>
    </div>
  );
};
