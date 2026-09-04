import React, { useState } from 'react';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Sparkles,
  HelpCircle,
  FolderKanban,
  History,
  Settings,
  Flame,
  FileText,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ResumeAnalysisResult } from '../types';
import { User } from 'firebase/auth';

export type NavTab =
  | 'dashboard'
  | 'upload'
  | 'analysis'
  | 'enhance-diff'
  | 'skill-gap'
  | 'improvements'
  | 'rewriter'
  | 'interview'
  | 'resumes'
  | 'history'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeAnalysis: ResumeAnalysisResult | null;
  onLoadDemo: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentUser: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeAnalysis,
  onLoadDemo,
  isOpenMobile,
  onCloseMobile,
  currentUser,
}) => {
  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };


  const navItemClass = (tab: NavTab) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-all ${
      currentTab === tab
        ? 'bg-slate-800 text-white shadow-xs border-l-2 border-blue-500 font-semibold pl-2.5'
        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
    }`;

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#0f172a] text-slate-300 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-extrabold text-white text-base shadow-sm group-hover:bg-blue-500 transition-colors">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base">
                  RESUMESENSE
                </span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide">High Density ATS Suite</p>
            </div>
          </button>

          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
          <div className="px-3 pb-1.5 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Core Workspace
          </div>

          <button
            id="nav-tab-dashboard"
            onClick={() => handleNavClick('dashboard')}
            className={`w-full ${navItemClass('dashboard')}`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-tab-upload"
            onClick={() => handleNavClick('upload')}
            className={`w-full ${navItemClass('upload')}`}
          >
            <Upload className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Analyze Resume</span>
          </button>


          {/* Active Report Section */}
          <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
            <span>Evaluation Report</span>
            {activeAnalysis && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </div>

          {activeAnalysis ? (
            <>
              <button
                id="nav-tab-analysis"
                onClick={() => handleNavClick('analysis')}
                className={`w-full ${navItemClass('analysis')}`}
              >
                <BarChart3 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="flex-1 text-left">Score & ATS Audit</span>
                <span className="text-[10px] bg-blue-900/60 text-blue-300 font-bold px-1.5 py-0.2 rounded">
                  {activeAnalysis.scores.overall}
                </span>
              </button>

              <button
                id="nav-tab-enhance-diff"
                onClick={() => handleNavClick('enhance-diff')}
                className={`w-full ${navItemClass('enhance-diff')} relative group`}
              >
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                <span className="flex-1 text-left font-semibold text-indigo-200">AI Enhance & Diff</span>
                <span className="text-[9px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  AI
                </span>
              </button>

              <button
                id="nav-tab-skill-gap"
                onClick={() => handleNavClick('skill-gap')}
                className={`w-full ${navItemClass('skill-gap')}`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="flex-1 text-left">Skill Gap Matrix</span>
              </button>

              <button
                id="nav-tab-improvements"
                onClick={() => handleNavClick('improvements')}
                className={`w-full ${navItemClass('improvements')}`}
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="flex-1 text-left">Actionable Fixes</span>
                {activeAnalysis.suggestions.length > 0 && (
                  <span className="text-[10px] bg-amber-900/60 text-amber-300 font-bold px-1.5 py-0.2 rounded">
                    {activeAnalysis.suggestions.length}
                  </span>
                )}
              </button>

              <button
                id="nav-tab-rewriter"
                onClick={() => handleNavClick('rewriter')}
                className={`w-full ${navItemClass('rewriter')}`}
              >
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>AI Rewriter</span>
              </button>

              <button
                id="nav-tab-interview"
                onClick={() => handleNavClick('interview')}
                className={`w-full ${navItemClass('interview')}`}
              >
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Interview Prep</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-2 text-[11px] text-slate-500 italic rounded bg-slate-900/50">
              No report loaded. Upload a resume to unlock detailed audits.
            </div>
          )}

          {/* Profile & History Section */}
          <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Profile Data
          </div>

          <button
            id="nav-tab-resumes"
            onClick={() => handleNavClick('resumes')}
            className={`w-full ${navItemClass('resumes')}`}
          >
            <FolderKanban className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Resume Profiles</span>
          </button>

          <button
            id="nav-tab-history"
            onClick={() => handleNavClick('history')}
            className={`w-full ${navItemClass('history')}`}
          >
            <History className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Analysis History</span>
          </button>

          <button
            id="nav-tab-settings"
            onClick={() => handleNavClick('settings')}
            className={`w-full ${navItemClass('settings')}`}
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Settings & Privacy</span>
          </button>
        </nav>
      </div>

      {/* Footer Info & Demo Loader */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={onLoadDemo}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-md transition-colors cursor-pointer border border-amber-500/20"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Load Interactive Demo</span>
        </button>

        <div className="px-2 pt-1 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Cloud Storage:</span>
          {currentUser ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Google Synced
            </span>
          ) : (
            <span className="text-slate-400 font-medium">Guest / Local</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left) */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 bg-[#0f172a] text-slate-300 flex-col border-r border-slate-800 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
