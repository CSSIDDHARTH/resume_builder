import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { ResumeAnalysisResult, SkillMatchItem, SkillMatchLevel } from '../types';
import { NavTab } from './Sidebar';

interface SkillGapViewProps {
  analysis: ResumeAnalysisResult;
  onNavigate: (tab: NavTab) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ analysis, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { skillsMatch, targetRole, targetCompany, resumeName } = analysis;

  const categories = ['all', ...Array.from(new Set(skillsMatch.map((s) => s.category)))];

  const filteredSkills = skillsMatch.filter((skill) => {
    const matchesSearch =
      skill.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.resumeEvidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.recommendedAction.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || skill.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const strongCount = skillsMatch.filter((s) => s.status === 'strong').length;
  const partialCount = skillsMatch.filter((s) => s.status === 'partial').length;
  const missingCount = skillsMatch.filter((s) => s.status === 'missing').length;
  const insufficientCount = skillsMatch.filter((s) => s.status === 'insufficient_evidence').length;

  const getStatusBadge = (status: SkillMatchLevel) => {
    switch (status) {
      case 'strong':
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">
            STRONG
          </span>
        );
      case 'partial':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
            PARTIAL
          </span>
        );
      case 'missing':
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
            MISSING
          </span>
        );
      case 'insufficient_evidence':
        return (
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">
            INSUFFICIENT
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
            Evidence-Based Skill Gap Matrix
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Comparing <strong className="text-slate-800">{resumeName}</strong> against requirements for{' '}
            <strong className="text-slate-800">{targetRole}</strong>{' '}
            {targetCompany ? `at ${targetCompany}` : ''}
          </p>
        </div>

        <button
          onClick={() => onNavigate('rewriter')}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Launch AI Rewriter</span>
        </button>
      </div>

      {/* Top 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('strong')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'strong'
              ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Strong Matches
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{strongCount}</div>
          <span className="text-[10px] text-slate-400">Explicitly validated</span>
        </button>

        <button
          onClick={() => setStatusFilter('partial')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'partial'
              ? 'border-amber-500 bg-amber-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Partial Matches
          </span>
          <div className="text-2xl font-bold text-amber-500 mt-1">{partialCount}</div>
          <span className="text-[10px] text-slate-400">Needs metric proof</span>
        </button>

        <button
          onClick={() => setStatusFilter('missing')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'missing'
              ? 'border-red-500 bg-red-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Missing Skills
          </span>
          <div className="text-2xl font-bold text-red-500 mt-1">{missingCount}</div>
          <span className="text-[10px] text-slate-400">Not detected in text</span>
        </button>

        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'border-blue-500 bg-blue-50/50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50 shadow-xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Evaluated
          </span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{skillsMatch.length}</div>
          <span className="text-[10px] text-slate-400">Click to show all</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skill, evidence keyword, or recommendation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-hidden cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="strong">Status: Strong</option>
            <option value="partial">Status: Partial</option>
            <option value="missing">Status: Missing</option>
            <option value="insufficient_evidence">Status: Insufficient</option>
          </select>
        </div>
      </div>

      {/* High Density Skills Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-xs border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="pb-1 pl-4">Required Skill / Category</th>
                <th className="pb-1">Status</th>
                <th className="pb-1">Resume Evidence Extracted</th>
                <th className="pb-1">Recommended Action</th>
                <th className="pb-1 pr-4 text-right">Handoff</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400 italic">
                    No skills matched the active filters.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-slate-50/90 rounded-lg' : 'bg-white rounded-lg'}
                  >
                    <td className="py-3 pl-4">
                      <div className="font-bold text-slate-800">{skill.skill}</div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {skill.category}
                      </span>
                    </td>

                    <td className="py-3 whitespace-nowrap">
                      {getStatusBadge(skill.status)}
                    </td>

                    <td className="py-3 max-w-xs text-slate-600 font-mono text-[11px] leading-relaxed">
                      {skill.resumeEvidence && skill.resumeEvidence !== 'None found'
                        ? skill.resumeEvidence
                        : '—'}
                    </td>

                    <td className="py-3 max-w-xs text-slate-700 text-xs leading-relaxed">
                      {skill.recommendedAction}
                    </td>

                    <td className="py-3 pr-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigate('rewriter')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Rewrite Bullet &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
