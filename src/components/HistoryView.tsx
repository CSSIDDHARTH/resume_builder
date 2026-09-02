import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Trash2,
  TrendingUp,
  Cloud,
  Loader2,
  Sparkles,
  Calendar,
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisHistoryItem, SavedCloudReport, ResumeAnalysisResult } from '../types';
import { deleteHistoryItem, clearAllHistory } from '../services/storage';
import {
  subscribeToUserReports,
  deleteUserReport,
  saveReportToFirestore,
} from '../services/firestoreService';
import { NavTab } from './Sidebar';
import { User } from 'firebase/auth';
import { AuthButton } from './AuthButton';

interface HistoryViewProps {
  history: AnalysisHistoryItem[];
  onRefreshHistory: () => void;
  onSelectReport: (result: ResumeAnalysisResult) => void;
  onNavigate: (tab: NavTab) => void;
  onLoadDemo: () => void;
  currentUser: User | null;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onRefreshHistory,
  onSelectReport,
  onNavigate,
  onLoadDemo,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'cloud' | 'local'>('cloud');
  const [cloudReports, setCloudReports] = useState<SavedCloudReport[]>([]);
  const [loadingCloud, setLoadingCloud] = useState<boolean>(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [isSyncingLocal, setIsSyncingLocal] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Live real-time Firestore sync
  useEffect(() => {
    if (!currentUser) {
      setCloudReports([]);
      setActiveTab('local');
      return;
    }

    setLoadingCloud(true);
    setCloudError(null);
    setActiveTab('cloud');

    const unsubscribe = subscribeToUserReports(
      currentUser.uid,
      (reports) => {
        setCloudReports(reports);
        setLoadingCloud(false);
      },
      (err) => {
        console.error('Firestore subscription error in HistoryView:', err);
        setCloudError('Unable to sync cloud reports. Please check your connection.');
        setLoadingCloud(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleDeleteLocal = (id: string) => {
    if (confirm('Delete this local analysis record?')) {
      deleteHistoryItem(id);
      onRefreshHistory();
    }
  };

  const handleClearAllLocal = () => {
    if (confirm('Are you sure you want to clear all local analysis history?')) {
      clearAllHistory();
      onRefreshHistory();
    }
  };

  const handleDeleteCloud = async (reportId: string) => {
    if (confirm('Delete this saved report from your Cloud History?')) {
      try {
        await deleteUserReport(reportId);
      } catch (err: any) {
        alert('Failed to delete report from cloud: ' + err.message);
      }
    }
  };

  // Sync local session reports to Firestore
  const handleSyncAllLocalToCloud = async () => {
    if (!currentUser) return;
    setIsSyncingLocal(true);
    setSyncSuccessMessage(null);

    try {
      let count = 0;
      for (const item of history) {
        if (item.result) {
          await saveReportToFirestore(
            currentUser.uid,
            item.result,
            `${item.targetRole} (${item.resumeTitle})`
          );
          count++;
        }
      }
      setSyncSuccessMessage(`Successfully synced ${count} local analysis report${count === 1 ? '' : 's'} to your Google Cloud account!`);
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Sync failed:', err);
      alert('Failed to sync reports to cloud: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSyncingLocal(false);
    }
  };

  // Filter local items
  const filteredLocalHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.resumeTitle.toLowerCase().includes(query) ||
      item.targetRole.toLowerCase().includes(query) ||
      (item.targetCompany && item.targetCompany.toLowerCase().includes(query))
    );
  });

  // Filter cloud items
  const filteredCloudReports = cloudReports.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.targetRole.toLowerCase().includes(query) ||
      (item.targetCompany && item.targetCompany.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Audit Archives & Cloud History
            </span>
            {currentUser && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Firestore Live Sync Active
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Saved Reports & Audit History
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Access past resume reports, monitor score progression across iterations, and sync your data securely to Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && history.length > 0 && (
            <button
              onClick={handleSyncAllLocalToCloud}
              disabled={isSyncingLocal}
              className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors"
              title="Backup all local session reports to your Google Cloud account"
            >
              {isSyncingLocal ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UploadCloud className="h-3.5 w-3.5" />
              )}
              <span>{isSyncingLocal ? 'Syncing...' : 'Sync Local to Cloud'}</span>
            </button>
          )}

          {activeTab === 'local' && history.length > 0 && (
            <button
              onClick={handleClearAllLocal}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Local</span>
            </button>
          )}
        </div>
      </div>

      {syncSuccessMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncSuccessMessage}</span>
        </div>
      )}

      {/* Auth Banner if not signed in */}
      {!currentUser && (
        <AuthButton variant="banner" currentUser={currentUser} />
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 sm:pb-0 sm:border-0">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cloud'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud Saved Reports</span>
            {currentUser && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500 text-white">
                {cloudReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'local'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Local Session History</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {history.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter saved reports..."
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden shadow-2xs"
          />
        </div>
      </div>

      {/* CLOUD TAB CONTENT */}
      {activeTab === 'cloud' && (
        <>
          {!currentUser ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Sign in to view your Cloud Saved Reports
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Connect your Google Account to automatically store, organize, and retrieve your resume analysis reports securely in Firebase Firestore.
              </p>
              <div className="mt-5 flex justify-center">
                <AuthButton currentUser={currentUser} />
              </div>
            </div>
          ) : loadingCloud ? (
            <div className="rounded-xl bg-white border border-slate-200 p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Fetching reports from Firestore Database...</p>
            </div>
          ) : filteredCloudReports.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto p-4">
                <table className="w-full text-xs border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <th className="pb-1 pl-4">Report Title & Role</th>
                      <th className="pb-1">Target Company</th>
                      <th className="pb-1">Match Score</th>
                      <th className="pb-1">ATS Score</th>
                      <th className="pb-1">Date Saved</th>
                      <th className="pb-1 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCloudReports.map((report, idx) => (
                      <tr
                        key={report.id}
                        className={idx % 2 === 0 ? 'bg-slate-50/80 rounded-lg' : 'bg-white rounded-lg'}
                      >
                        <td className="py-3 pl-4">
                          <div className="font-bold text-slate-900">{report.title}</div>
                          <div className="text-[11px] text-slate-500">{report.targetRole}</div>
                        </td>

                        <td className="py-3 font-semibold text-slate-700">
                          {report.targetCompany || <span className="text-slate-400 italic">General</span>}
                        </td>

                        <td className="py-3">
                          <span className="font-bold font-mono text-sm text-blue-600">
                            {report.overallScore}%
                          </span>
                        </td>

                        <td className="py-3">
                          <span className="font-bold font-mono text-sm text-slate-800">
                            {report.atsScore}/100
                          </span>
                        </td>

                        <td className="py-3 text-[11px] text-slate-400 font-mono">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 pr-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                onSelectReport(report.analysisResult);
                                onNavigate('analysis');
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                              Open Report &rarr;
                            </button>
                            <button
                              onClick={() => handleDeleteCloud(report.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 cursor-pointer rounded hover:bg-red-50"
                              title="Delete from Firestore"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <Cloud className="mx-auto h-8 w-8 text-blue-400 mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Cloud Reports Saved Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Any analysis you run while logged in is automatically saved here! You can also click <strong className="text-slate-700">"Save to Cloud"</strong> on any report.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Analyze a Resume Now
                </button>
                {history.length > 0 && (
                  <button
                    onClick={handleSyncAllLocalToCloud}
                    className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-xs font-semibold hover:bg-blue-100 cursor-pointer shadow-xs"
                  >
                    Sync Current Session History
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* LOCAL TAB CONTENT */}
      {activeTab === 'local' && (
        <>
          {filteredLocalHistory.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto p-4">
                <table className="w-full text-xs border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <th className="pb-1 pl-4">Target Role & Company</th>
                      <th className="pb-1">Candidate Profile</th>
                      <th className="pb-1">Overall Match</th>
                      <th className="pb-1">ATS Score</th>
                      <th className="pb-1">Date Analyzed</th>
                      <th className="pb-1 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLocalHistory.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={idx % 2 === 0 ? 'bg-slate-50/80 rounded-lg' : 'bg-white rounded-lg'}
                      >
                        <td className="py-3 pl-4">
                          <div className="font-bold text-slate-900">{item.targetRole}</div>
                          {item.targetCompany && (
                            <div className="text-[11px] text-blue-600 font-semibold">{item.targetCompany}</div>
                          )}
                        </td>

                        <td className="py-3 font-medium text-slate-700">
                          {item.resumeTitle}
                        </td>

                        <td className="py-3">
                          <span className="font-bold font-mono text-sm text-blue-600">
                            {item.overallScore}%
                          </span>
                        </td>

                        <td className="py-3">
                          <span className="font-bold font-mono text-sm text-slate-800">
                            {item.atsScore}/100
                          </span>
                        </td>

                        <td className="py-3 text-[11px] text-slate-400 font-mono">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </td>

                        <td className="py-3 pr-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                onSelectReport(item.result);
                                onNavigate('analysis');
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                              View Report &rarr;
                            </button>
                            <button
                              onClick={() => handleDeleteLocal(item.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 cursor-pointer rounded hover:bg-red-50"
                              title="Delete record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <History className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Local History Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Audits you run in this browser session will appear here.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Analyze a Resume
                </button>
                <button
                  onClick={onLoadDemo}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Load Sample Audit
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
