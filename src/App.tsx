/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';

import { DashboardView } from './components/DashboardView';
import { UploadAnalyzeView } from './components/UploadAnalyzeView';
import { AnalysisOverview } from './components/AnalysisOverview';
import { SkillGapView } from './components/SkillGapView';
import { ResumeImprovementsView } from './components/ResumeImprovementsView';
import { AIRewriterView } from './components/AIRewriterView';
import { AIEnhanceComparisonView } from './components/AIEnhanceComparisonView';
import { InterviewPrepView } from './components/InterviewPrepView';
import { ResumeManagerView } from './components/ResumeManagerView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';

import {
  ResumeAnalysisResult,
  SavedResume,
  AnalysisHistoryItem,
  EnhancedResumeResult,
} from './types';
import {
  getActiveAnalysis,
  setActiveAnalysis,
  getStoredResumes,
  saveResume,
  getAnalysisHistory,
  saveAnalysisToHistory,
} from './services/storage';
import { DEMO_PRECOMPUTED_REPORT, DEMO_ENHANCED_RESUME, SAMPLE_RESUMES } from './data/demoData';
import { analyzeResume } from './services/api';
import { subscribeToAuth, saveReportToFirestore } from './services/firestoreService';
import { User } from 'firebase/auth';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeAnalysis, setActiveAnalysisState] = useState<ResumeAnalysisResult | null>(null);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedResumeResult | null>(null);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isReAnalyzing, setIsReAnalyzing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Cross-component rewriter handoff state
  const [rewriterInitialText, setRewriterInitialText] = useState<string>('');
  const [rewriterInitialContext, setRewriterInitialContext] = useState<string>('');

  useEffect(() => {
    // Hydrate state from local storage on load
    const storedResumes = getStoredResumes();
    const storedHistory = getAnalysisHistory();
    const storedActive = getActiveAnalysis();

    setSavedResumes(storedResumes);
    setHistory(storedHistory);
    setActiveAnalysisState(storedActive || DEMO_PRECOMPUTED_REPORT);
    setEnhancedResult(DEMO_ENHANCED_RESUME);

    // Subscribe to Firebase Auth
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleAnalysisComplete = async (result: ResumeAnalysisResult) => {
    setActiveAnalysisState(result);
    setActiveAnalysis(result);
    saveAnalysisToHistory(result);
    setHistory(getAnalysisHistory());
    setEnhancedResult(null); // Reset until user enhances
    setCurrentTab('analysis');

    if (currentUser) {
      try {
        await saveReportToFirestore(currentUser.uid, result);
      } catch (cloudErr) {
        console.warn('Auto-save to Firestore failed:', cloudErr);
      }
    }
  };

  const handleLoadDemo = () => {
    setActiveAnalysisState(DEMO_PRECOMPUTED_REPORT);
    setActiveAnalysis(DEMO_PRECOMPUTED_REPORT);
    setEnhancedResult(DEMO_ENHANCED_RESUME);
    saveAnalysisToHistory(DEMO_PRECOMPUTED_REPORT);
    setHistory(getAnalysisHistory());
    setCurrentTab('dashboard');
  };

  const handleReAnalyzeEnhanced = async (enhancedText: string) => {
    if (!activeAnalysis) return;
    setIsReAnalyzing(true);
    try {
      const newAnalysis = await analyzeResume(
        enhancedText,
        activeAnalysis.rawJobDescriptionSnippet || '',
        `${activeAnalysis.resumeName} (Enhanced)`
      );
      handleAnalysisComplete(newAnalysis);
    } catch (err) {
      console.error('Re-analysis error:', err);
    } finally {
      setIsReAnalyzing(false);
    }
  };

  const handleSaveProfileFromEnhance = (profile: SavedResume) => {
    saveResume(profile);
    setSavedResumes(getStoredResumes());
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setActiveAnalysisState(item.result);
    setActiveAnalysis(item.result);
    setCurrentTab('analysis');
  };

  const handleSendToRewriter = (bulletText: string, context?: string) => {
    setRewriterInitialText(bulletText);
    setRewriterInitialContext(context || '');
    setCurrentTab('rewriter');
  };

  const handleSelectResumeForAnalysis = (resume: SavedResume) => {
    setCurrentTab('upload');
  };

  const handleRefreshResumes = () => {
    setSavedResumes(getStoredResumes());
  };

  const handleRefreshHistory = () => {
    setHistory(getAnalysisHistory());
  };

  const handleResetToDemo = () => {
    localStorage.clear();
    setSavedResumes(SAMPLE_RESUMES);
    setHistory(getAnalysisHistory());
    setActiveAnalysisState(DEMO_PRECOMPUTED_REPORT);
    setActiveAnalysis(DEMO_PRECOMPUTED_REPORT);
    setCurrentTab('dashboard');
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      {/* High Density Dark Slate Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        activeAnalysis={activeAnalysis}
        onLoadDemo={handleLoadDemo}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
      />

      {/* Main Content Area with Sticky Header */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          activeAnalysis={activeAnalysis}
          onLoadDemo={handleLoadDemo}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          currentUser={currentUser}
          onAuthSuccess={(user) => setCurrentUser(user)}
          onSignOutSuccess={() => setCurrentUser(null)}
        />

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-6">


          {currentTab === 'dashboard' && (
            <DashboardView
              activeAnalysis={activeAnalysis}
              history={history}
              onNavigate={handleSelectTab}
              onSelectHistoryItem={handleSelectHistoryItem}
              onLoadDemo={handleLoadDemo}
            />
          )}

          {currentTab === 'upload' && (
            <UploadAnalyzeView
              onAnalysisComplete={handleAnalysisComplete}
              savedResumes={savedResumes}
            />
          )}

          {currentTab === 'analysis' && activeAnalysis && (
            <AnalysisOverview
              analysis={activeAnalysis}
              onNavigate={handleSelectTab}
              currentUser={currentUser}
              onSavedToCloud={() => {
                handleRefreshHistory();
              }}
            />
          )}

          {currentTab === 'enhance-diff' && (
            <AIEnhanceComparisonView
              activeAnalysis={activeAnalysis}
              enhancedResult={enhancedResult}
              onUpdateEnhancedResult={(res) => setEnhancedResult(res)}
              onReAnalyze={handleReAnalyzeEnhanced}
              onSaveProfile={handleSaveProfileFromEnhance}
              onNavigateToUpload={() => handleSelectTab('upload')}
            />
          )}

          {currentTab === 'skill-gap' && activeAnalysis && (
            <SkillGapView
              analysis={activeAnalysis}
              onNavigate={handleSelectTab}
            />
          )}

          {currentTab === 'improvements' && activeAnalysis && (
            <ResumeImprovementsView
              analysis={activeAnalysis}
              onNavigate={handleSelectTab}
              onSendToRewriter={handleSendToRewriter}
            />
          )}

          {currentTab === 'rewriter' && (
            <AIRewriterView
              initialText={rewriterInitialText}
              initialContext={rewriterInitialContext}
            />
          )}

          {currentTab === 'interview' && activeAnalysis && (
            <InterviewPrepView analysis={activeAnalysis} />
          )}

          {currentTab === 'resumes' && (
            <ResumeManagerView
              resumes={savedResumes}
              onRefreshResumes={handleRefreshResumes}
              onSelectForAnalysis={handleSelectResumeForAnalysis}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              history={history}
              onRefreshHistory={handleRefreshHistory}
              onSelectReport={(result) => {
                setActiveAnalysisState(result);
                setActiveAnalysis(result);
              }}
              onNavigate={handleSelectTab}
              onLoadDemo={handleLoadDemo}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              onResetToDemo={handleResetToDemo}
              onRefreshAll={() => {
                handleRefreshResumes();
                handleRefreshHistory();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
