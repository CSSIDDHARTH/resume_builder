import React from 'react';
import { Upload, History, Menu } from 'lucide-react';
import { ResumeAnalysisResult } from '../types';
import type { NavTab } from './Sidebar';
import { User } from 'firebase/auth';
import { AuthButton } from './AuthButton';

export type { NavTab };

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeAnalysis: ResumeAnalysisResult | null;
  onLoadDemo: () => void;
  onOpenMobileMenu?: () => void;
  currentUser: User | null;
  onAuthSuccess?: (user: User) => void;
  onSignOutSuccess?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeAnalysis,
  onOpenMobileMenu,
  currentUser,
  onAuthSuccess,
  onSignOutSuccess,
}) => {
  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Menu + Brand Logo + Active Analysis Pill */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
          title="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand Clickable */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xs transition-all transform group-hover:scale-105">
            R
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                RESUMESENSE
              </span>
              <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80">
                PRO
              </span>
            </div>
          </div>
        </button>

        {/* Active Analysis Indicator Pill */}
        {activeAnalysis && (
          <button
            onClick={() => onSelectTab('analysis')}
            className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-slate-200 text-xs hover:opacity-80 cursor-pointer transition-opacity"
            title="Click to view current analysis report"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-700 truncate max-w-[180px]">
              {activeAnalysis.targetRole}
            </span>
            <span className="font-mono font-bold text-[11px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
              {activeAnalysis.scores.overall}% Match
            </span>
          </button>
        )}
      </div>

      {/* Right: Quick Action Buttons (Upload & History) + Auth Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Analyze Resume Quick Action */}
        <button
          onClick={() => onSelectTab('upload')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentTab === 'upload'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Analyze Resume</span>
        </button>

        {/* History / Saved Audits Button */}
        <button
          onClick={() => onSelectTab('history')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentTab === 'history'
              ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs font-bold'
              : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
          }`}
          title="View your saved reports and upload history"
        >
          <History className={`w-3.5 h-3.5 ${currentTab === 'history' ? 'text-blue-600' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">My Saved Audits</span>
          <span className="sm:hidden">History</span>
          {currentUser && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Cloud Sync Active"></span>
          )}
        </button>

        {/* User Google Auth Button */}
        <AuthButton
          currentUser={currentUser}
          onAuthSuccess={onAuthSuccess}
          onSignOutSuccess={onSignOutSuccess}
          onNavigate={onSelectTab}
        />
      </div>
    </header>
  );
};
