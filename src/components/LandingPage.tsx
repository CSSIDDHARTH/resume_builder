import React from 'react';
import {
  ShieldCheck,
  Zap,
  Target,
  FileCheck2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  onTryDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onTryDemo }) => {
  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-4">
            <Sparkles className="h-3 w-3" />
            <span>High Density ATS Intelligence Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Evidence-based resume intelligence & interview defense.
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Stop sending unoptimized resumes into black-box application tracking systems. Get instant ATS compliance audits, 6-dimension weighted scoring, precision STAR bullet restructuring, and role-specific technical interview prep.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <span>Analyze Your Resume</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onTryDemo}
              className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <span>Load Interactive Demo Report</span>
            </button>
          </div>

          {/* Feature Guarantees */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Native PDF & DOCX Parser</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Truth-Preserving AI Rewriter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-600" />
              <span>Client-Side Ephemeral Storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE CAPABILITIES CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              ATS Compatibility Audit
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Detect table structures, parsing hurdles, missing contact fields, and formatting penalties before recruiters do.
            </p>
          </div>
          <span className="text-[10px] font-bold text-blue-600 font-mono">PARSING SCORE &rarr;</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Evidence-Based Skill Gap
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Maps exact job requirements against text evidence in your resume with strong, partial, or missing classifications.
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 font-mono">GAP MATRIX &rarr;</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              STAR Bullet Restructuring
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Transforms weak, unquantified bullets into impactful Action-Task-Result achievements without fake metrics.
            </p>
          </div>
          <span className="text-[10px] font-bold text-purple-600 font-mono">AI REWRITER &rarr;</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-3">
              04
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Targeted Interview Defense
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Generates customized technical, behavioral, and architecture questions based on your resume's claims and project scope.
            </p>
          </div>
          <span className="text-[10px] font-bold text-amber-600 font-mono">INTERVIEW PREP &rarr;</span>
        </div>
      </div>
    </div>
  );
};
