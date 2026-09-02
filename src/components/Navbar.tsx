import React, { useState } from 'react';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  History,
  FolderKanban,
  Menu,
  ChevronDown,
  Compass,
} from 'lucide-react';
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Primary navigation links shown in top navbar
  const primaryNavItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Analyze', icon: Upload },
    { id: 'analysis', label: 'ATS Audit', icon: BarChart3 },
    {
      id: 'enhance-diff',
      label: 'AI Enhance & Diff',
      icon: Sparkles,
      highlight: true,
      badge: 'AI',
    },
    { id: 'skill-gap', label: 'Skill Gap', icon: CheckCircle2 },
    { id: 'improvements', label: 'Fixes', icon: AlertCircle },
    { id: 'rewriter', label: 'STAR Rewriter', icon: Sparkles },
    { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
    { id: 'history', label: 'Saved Reports', icon: History },
  ];

  const secondaryNavItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'resumes', label: 'Resume Profiles', icon: FolderKanban },
    { id: 'landing', label: 'Platform Features', icon: Compass },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === currentTab);

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30 shadow-2xs">
      {/* Left: Brand + Mobile Menu Button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand Clickable */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-7 h-7 bg-blue-600 group-hover:bg-blue-700 text-white rounded-lg flex items-center justify-center font-extrabold text-sm shadow-2xs transition-colors">
            R
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-sm hidden sm:inline">
            RESUMESENSE
          </span>
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline">
            PRO
          </span>
        </button>

        {/* Active Analysis Indicator Pill */}
        {activeAnalysis && (
          <div className="hidden 2xl:flex items-center gap-1.5 pl-2 border-l border-slate-200 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium truncate max-w-[140px] text-slate-700">
              {activeAnalysis.targetRole}
            </span>
          </div>
        )}
      </div>

      {/* Center: Navigation Links in Navbar */}
      <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 px-2 overflow-x-auto scrollbar-none py-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-2xs'
                    : 'bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive
                    ? item.highlight
                      ? 'text-indigo-600'
                      : 'text-blue-600'
                    : item.highlight
                    ? 'text-indigo-500'
                    : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1 rounded uppercase tracking-wider ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* More Dropdown for additional workspace pages */}
        <div className="relative">
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              isSecondaryActive
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
            }`}
          >
            <span>More</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isMoreMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMoreMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center gap-2 cursor-pointer font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Right: Google Account Auth Button */}
      <div className="flex items-center gap-2 shrink-0">
        <AuthButton
          currentUser={currentUser}
          onAuthSuccess={onAuthSuccess}
          onSignOutSuccess={onSignOutSuccess}
        />
      </div>
    </header>
  );
};
