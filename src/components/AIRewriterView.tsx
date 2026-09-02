import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Zap,
  Sliders,
  FileText,
  AlignLeft,
} from 'lucide-react';
import { rewriteResumeText } from '../services/api';
import { RewriteResponse, RewriteStyle } from '../types';

interface AIRewriterViewProps {
  initialText?: string;
  initialContext?: string;
}

const SAMPLE_REWRITE_INPUTS = [
  {
    title: 'Weak Backend Bullet',
    section: 'experience',
    text: 'Worked on the backend APIs and helped fix latency issues in the database queries.',
    context: 'Senior Backend Engineer role requiring Go, Postgres, and high-concurrency scaling.',
  },
  {
    title: 'Generic Summary',
    section: 'summary',
    text: 'Hardworking software developer with experience in full-stack web applications looking for new opportunities in tech.',
    context: 'Full Stack Engineer with React, Node.js, and Cloud Infrastructure experience.',
  },
  {
    title: 'Vague DevOps Bullet',
    section: 'experience',
    text: 'Set up CI/CD pipelines and managed AWS cloud infrastructure for our services.',
    context: 'DevOps / Platform Engineer focusing on Terraform, Kubernetes, and reducing deployment times.',
  },
];

export const AIRewriterView: React.FC<AIRewriterViewProps> = ({
  initialText = '',
  initialContext = '',
}) => {
  const [inputText, setInputText] = useState<string>(initialText || SAMPLE_REWRITE_INPUTS[0].text);
  const [sectionType, setSectionType] = useState<string>('experience');
  const [style, setStyle] = useState<RewriteStyle>('impact');
  const [jobContext, setJobContext] = useState<string>(initialContext || SAMPLE_REWRITE_INPUTS[0].context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunRewrite = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter text to rewrite.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const resp = await rewriteResumeText(inputText, sectionType, style, jobContext);
      setResult(resp);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to rewrite text. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectSample = (sample: typeof SAMPLE_REWRITE_INPUTS[0]) => {
    setInputText(sample.text);
    setSectionType(sample.section);
    setJobContext(sample.context);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Truth-Preserving AI Resume Rewriter
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Transform vague statements into quantified, high-impact STAR bullet points without inventing false credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Anti-Hallucination Guard Active</span>
          </span>
        </div>
      </div>

      {/* Quick Samples Pill Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Quick Starters:
        </span>
        {SAMPLE_REWRITE_INPUTS.map((sample, i) => (
          <button
            key={i}
            onClick={() => handleSelectSample(sample)}
            className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Main Rewrite Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Input & Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Input Resume Text / Bullet
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {inputText.length} chars
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the bullet point or paragraph you wish to upgrade..."
                rows={4}
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Target Style Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Target Tone / Optimization Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'impact', label: 'STAR & Impact', desc: 'Action + Context + Quantified Outcome' },
                  { id: 'concise', label: 'Executive & Concise', desc: 'Direct, punchy, high-efficiency phrasing' },
                  { id: 'ats-optimized', label: 'ATS Keyword Depth', desc: 'Targeted keyword & verb infusion' },
                  { id: 'technical', label: 'Technical Architecture', desc: 'Tooling, complexity, and scale focus' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStyle(st.id as RewriteStyle)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      style === st.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800">{st.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{st.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Job Context */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Target Job Context (Optional but Recommended)
              </label>
              <input
                type="text"
                value={jobContext}
                onChange={(e) => setJobContext(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer requiring React, TypeScript, and high-performance WebGL"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleRunRewrite}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Synthesizing High-Impact Variation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate STAR Rewrite</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Output & Diff */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Optimized Output</span>
                </span>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded cursor-pointer transition-colors font-medium"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              {/* High Density Rewritten Text Card */}
              <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                <p className="text-xs font-mono font-medium text-slate-900 leading-relaxed">
                  {result.rewrittenText}
                </p>
              </div>

              {/* Rationale & Changes */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Why this version is stronger:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {result.changesMade && result.changesMade.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Modifications Applied:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {result.changesMade.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
              <Sparkles className="h-8 w-8 text-slate-300 mb-2" />
              <div className="text-xs font-bold text-slate-600">Ready to Polish</div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Select a sample or paste your own bullet point and click "Generate STAR Rewrite" to produce upgraded content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
