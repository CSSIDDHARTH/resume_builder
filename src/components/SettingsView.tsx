import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Trash2,
  RefreshCw,
  Sliders,
  Database,
  CheckCircle2,
  Flame,
  Info,
} from 'lucide-react';
import { AppSettings, getAppSettings, saveAppSettings, clearAllHistory } from '../services/storage';

interface SettingsViewProps {
  onResetToDemo: () => void;
  onRefreshAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetToDemo,
  onRefreshAll,
}) => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleUpdateStrictness = (strictness: 'standard' | 'strict') => {
    const updated = { ...settings, atsStrictness: strictness };
    setSettings(updated);
    saveAppSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggleAutoSave = (val: boolean) => {
    const updated = { ...settings, autoSaveHistory: val };
    setSettings(updated);
    saveAppSettings(updated);
  };

  const handleClearHistory = () => {
    if (confirm('Clear all analysis runs from your local browser storage?')) {
      clearAllHistory();
      onRefreshAll();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Settings & Evaluation Preferences
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Configure parser strictness, storage preferences, and security settings.
          </p>
        </div>

        {savedSuccess && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* Parser Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          ATS Evaluation Rigor
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => handleUpdateStrictness('standard')}
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              settings.atsStrictness === 'standard'
                ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Standard Parsing Mode</span>
              {settings.atsStrictness === 'standard' && (
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Balanced evaluation allowing synonymous skills and modern formatting conventions.
            </p>
          </div>

          <div
            onClick={() => handleUpdateStrictness('strict')}
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              settings.atsStrictness === 'strict'
                ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Strict Fortune-500 Mode</span>
              {settings.atsStrictness === 'strict' && (
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Enforces exact keyword tokens and rejects any layout deviations or non-standard headers.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy and Local Persistence */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Data Management & Local Privacy
        </h2>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-900">Auto-Save Evaluation Runs</div>
            <p className="text-[11px] text-slate-500">
              Preserve reports in browser local storage for instant review.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoSaveHistory}
            onChange={(e) => handleToggleAutoSave(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleClearHistory}
            className="px-3.5 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
          >
            Clear Local History
          </button>

          <button
            onClick={onResetToDemo}
            className="px-3.5 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            Reset Workspace to Default Demo
          </button>
        </div>
      </div>
    </div>
  );
};
