import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit3,
  FileText,
  Upload,
  ArrowRight,
  Download,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { SavedResume } from '../types';
import { NavTab } from './Sidebar';
import { saveResume, deleteResume } from '../services/storage';

interface ResumeManagerViewProps {
  resumes: SavedResume[];
  onRefreshResumes: () => void;
  onSelectForAnalysis: (resume: SavedResume) => void;
}

export const ResumeManagerView: React.FC<ResumeManagerViewProps> = ({
  resumes,
  onRefreshResumes,
  onSelectForAnalysis,
}) => {
  const [selectedResume, setSelectedResume] = useState<SavedResume | null>(resumes[0] || null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newTargetRole, setNewTargetRole] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSaveNew = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const resume: SavedResume = {
      id: `resume-${Date.now()}`,
      title: newTitle.trim(),
      textContent: newContent.trim(),
      targetRole: newTargetRole.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveResume(resume);
    onRefreshResumes();
    setSelectedResume(resume);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewContent('');
    setNewTargetRole('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this resume profile?')) {
      deleteResume(id);
      onRefreshResumes();
      if (selectedResume?.id === id) {
        setSelectedResume(null);
      }
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (resume: SavedResume) => {
    const blob = new Blob([resume.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Resume Profile Manager
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Store and manage role-specific resume variants for quick cross-audits.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(true)}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Resume Profile</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Resume List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Saved Profiles ({resumes.length})
          </span>

          <div className="space-y-2">
            {resumes.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  setSelectedResume(res);
                  setIsCreatingNew(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedResume?.id === res.id && !isCreatingNew
                    ? 'border-blue-600 bg-white shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-blue-600 font-medium truncate mt-0.5">
                      {res.targetRole || 'General Profile'}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      {res.textContent.split(/\s+/).length} words • {new Date(res.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(res.id);
                    }}
                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    title="Delete profile"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Profile Viewer or Editor */}
        <div className="lg:col-span-8">
          {isCreatingNew ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Create New Profile
                </h3>
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Profile Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer Profile (2026)"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Target Role / Specialty
                </label>
                <input
                  type="text"
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  placeholder="e.g. Frontend / React / Design Systems"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Resume Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste plain text resume content..."
                  rows={12}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNew}
                  className="px-4 py-1.5 rounded-md bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </div>
          ) : selectedResume ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {selectedResume.title}
                  </h2>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    {selectedResume.targetRole || 'General Profile'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(selectedResume.textContent)}
                    className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload(selectedResume)}
                    className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded cursor-pointer transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => onSelectForAnalysis(selectedResume)}
                    className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded shadow-xs cursor-pointer transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Audit Resume</span>
                  </button>
                </div>
              </div>

              {/* Text Preview */}
              <div className="bg-slate-50/70 rounded-lg p-4 border border-slate-100 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedResume.textContent}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
              Select a resume profile on the left or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
