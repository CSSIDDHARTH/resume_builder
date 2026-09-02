import React, { useState } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  Search,
  Sparkles,
  BarChart3,
  Calendar,
  Briefcase,
  Layers,
  ArrowRight,
  FileDown,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisHistoryItem, ResumeAnalysisResult } from '../types';
import { deleteHistoryItem, clearAllHistory } from '../services/storage';
import { NavTab } from './Sidebar';

interface HistoryViewProps {
  history: AnalysisHistoryItem[];
  onRefreshHistory: () => void;
  onSelectReport: (result: ResumeAnalysisResult) => void;
  onNavigate: (tab: NavTab) => void;
  onLoadDemo: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onRefreshHistory,
  onSelectReport,
  onNavigate,
  onLoadDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleDeleteLocalItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    onRefreshHistory();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your local analysis history?')) {
      clearAllHistory();
      onRefreshHistory();
    }
  };

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.targetRole.toLowerCase().includes(q) ||
      item.resumeName.toLowerCase().includes(q) ||
      (item.targetCompany && item.targetCompany.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Saved Audit Archives
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Private Local Storage Active</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Resume Analysis History
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Access past resume reports, monitor score progression across iterations, and view full ATS audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer transition-colors"
          >
            <span>+ New Analysis</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'Report' : 'Reports'} Found
          </span>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, candidate, or company..."
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden shadow-2xs"
          />
        </div>
      </div>

      {/* HISTORY REPORTS LIST */}
      {filteredHistory.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectReport(item.result);
                  onNavigate('analysis');
                }}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Score pill */}
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold text-white shadow-xs ${
                      item.overallScore >= 85
                        ? 'bg-emerald-600'
                        : item.overallScore >= 70
                        ? 'bg-blue-600'
                        : item.overallScore >= 55
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  >
                    <span className="text-base leading-none">{item.overallScore}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90">Score</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.targetRole}
                      </h3>
                      {item.targetCompany && (
                        <span className="text-xs text-slate-500 font-medium">
                          at {item.targetCompany}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        ATS {item.atsScore}%
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                      <span className="font-medium text-slate-600 truncate max-w-xs">
                        {item.resumeName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectReport(item.result);
                      onNavigate('analysis');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <span>Open Report</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteLocalItem(e, item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete report from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {searchQuery ? 'No matching reports found' : 'No analysis reports saved yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery
              ? 'Try changing your search query or clear the filter to view all saved reports.'
              : 'Upload and analyze a resume to generate comprehensive ATS audits. All reports are automatically saved to your private local history.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              Analyze a Resume
            </button>
            <button
              onClick={onLoadDemo}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Load Demo Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
