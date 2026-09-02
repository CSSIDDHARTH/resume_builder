import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Copy,
  Check,
  Target,
  FileCheck2,
} from 'lucide-react';
import { ResumeAnalysisResult, SuggestionItem, BulletPointEvaluation } from '../types';
import { NavTab } from './Sidebar';

interface ResumeImprovementsViewProps {
  analysis: ResumeAnalysisResult;
  onNavigate: (tab: NavTab) => void;
  onSendToRewriter: (bulletText: string, context?: string) => void;
}

export const ResumeImprovementsView: React.FC<ResumeImprovementsViewProps> = ({
  analysis,
  onNavigate,
  onSendToRewriter,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'suggestions' | 'bullets' | 'sections'>('bullets');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const { suggestions, bulletPointEvaluations, sectionEvaluations } = analysis;

  const filteredSuggestions = suggestions.filter((s) => {
    if (priorityFilter === 'all') return true;
    return s.priority === priorityFilter;
  });

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getPriorityBadge = (priority: SuggestionItem['priority']) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
            HIGH PRIORITY
          </span>
        );
      case 'medium':
        return (
          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
            MEDIUM
          </span>
        );
      case 'optional':
        return (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
            POLISH
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Actionable Resume Improvements
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Targeted STAR bullet point restructuring, priority suggestions, and section-by-section health audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('enhance-diff')}
            className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:from-indigo-700 hover:to-blue-700 cursor-pointer transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Enhance & Before/After Diff</span>
          </button>

          <button
            onClick={() => onNavigate('rewriter')}
            className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-900 cursor-pointer transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Rewriter</span>
          </button>
        </div>
      </div>

      {/* High Density Sub-tab Switcher */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('bullets')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'bullets'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Bullet Point Restructuring ({bulletPointEvaluations?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'suggestions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Priority Recommendations ({suggestions.length})
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'sections'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Section-by-Section Health ({sectionEvaluations?.length || 0})
        </button>
      </div>

      {/* SUB-TAB 1: BULLET POINT RESTRUCTURING */}
      {activeTab === 'bullets' && (
        <div className="space-y-4">
          {bulletPointEvaluations && bulletPointEvaluations.length > 0 ? (
            bulletPointEvaluations.map((bullet, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Bullet Header */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Bullet #{idx + 1}: {bullet.sectionTitle || (bullet as any).section || 'Experience'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        bullet.score >= 80
                          ? 'bg-emerald-100 text-emerald-700'
                          : bullet.score >= 60
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      Impact Score: {bullet.score}/100
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(bullet.suggestedRewrite || bullet.originalBullet, idx)}
                      className="text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIdx === idx ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy Rewrite'}</span>
                    </button>
                    <button
                      onClick={() =>
                        onSendToRewriter(
                          bullet.originalBullet,
                          `Context: ${bullet.sectionTitle || (bullet as any).section || 'Experience'}`
                        )
                      }
                      className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Customize in Playground</span>
                    </button>
                  </div>
                </div>

                {/* High Density Side-by-Side Comparison */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Current Original */}
                  <div className="lg:border-r border-slate-100 lg:pr-5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Current Bullet (Original Text)</span>
                      <span className="text-red-500 lowercase font-normal font-mono">weak metrics</span>
                    </div>
                    <p className="text-xs text-slate-600 line-through decoration-slate-300 font-mono leading-relaxed bg-slate-50/70 p-3 rounded border border-slate-100">
                      {bullet.originalBullet}
                    </p>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Weakness Detected
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {(bullet as any).issues
                          ? Array.isArray((bullet as any).issues)
                            ? (bullet as any).issues.join(' • ')
                            : String((bullet as any).issues)
                          : bullet.weakness || 'Missing quantifiable metrics or strong action verbs.'}
                      </p>
                    </div>
                  </div>

                  {/* High Density Suggested Rewrite */}
                  <div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Recommended Rewrite (STAR Format)</span>
                      <span className="text-emerald-600 lowercase font-normal font-mono">quantified + action verb</span>
                    </div>
                    <p className="text-xs text-slate-800 font-mono font-medium leading-relaxed bg-emerald-50/60 p-3 rounded border border-emerald-200">
                      {bullet.suggestedRewrite || bullet.originalBullet}
                    </p>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Applied Improvements
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {(bullet as any).rationale ||
                          (bullet.quantifiableResultPresent
                            ? 'Enhanced with quantified results, dynamic action verbs, and STAR context.'
                            : 'Clarified technical responsibilities, added actionable framing, and increased specificity.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 italic bg-white rounded-xl border border-slate-200">
              No individual bullet point evaluations available.
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PRIORITY SUGGESTIONS */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 pb-2">
            {['all', 'critical', 'high', 'medium', 'optional'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer uppercase transition-colors ${
                  priorityFilter === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{item.category}</span>
                    {getPriorityBadge(item.priority)}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.details}</p>
                </div>

                {item.concreteExample && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-700">
                    <strong className="text-slate-900 font-bold block mb-1">Example:</strong>
                    {item.concreteExample}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SECTION-BY-SECTION HEALTH */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          {sectionEvaluations && sectionEvaluations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectionEvaluations.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">{sec.sectionName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          sec.score >= 80
                            ? 'bg-emerald-100 text-emerald-700'
                            : sec.score >= 60
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        Score: {sec.score}/100
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Identified Weaknesses:
                        </span>
                        <ul className="text-xs text-slate-600 list-disc list-inside mt-0.5 space-y-0.5">
                          {sec.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Suggested Action:
                        </span>
                        <p className="text-xs text-slate-700 mt-0.5">{sec.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => onNavigate('rewriter')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Rewrite in AI Playground &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 italic bg-white rounded-xl border border-slate-200">
              No section-specific audits recorded.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
