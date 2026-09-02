import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Code2,
  UserCheck,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { ResumeAnalysisResult, InterviewQuestionItem } from '../types';

interface InterviewPrepViewProps {
  analysis: ResumeAnalysisResult;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({ analysis }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [copied, setCopied] = useState<boolean>(false);

  const { interviewQuestions, targetRole, targetCompany, resumeName } = analysis;

  const categories = ['all', 'technical', 'behavioral', 'resume_deep_dive', 'project_deep_dive'];

  const filteredQuestions = interviewQuestions.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const getCategoryLabel = (cat: InterviewQuestionItem['category']) => {
    switch (cat) {
      case 'technical':
        return { label: 'Technical & Domain', border: 'border-blue-500', bg: 'bg-blue-50/70', tag: 'text-blue-600' };
      case 'behavioral':
        return { label: 'Behavioral (STAR)', border: 'border-emerald-500', bg: 'bg-emerald-50/70', tag: 'text-emerald-700' };
      case 'resume_deep_dive':
        return { label: 'Resume Deep-Dive', border: 'border-amber-500', bg: 'bg-amber-50/70', tag: 'text-amber-700' };
      case 'project_deep_dive':
        return { label: 'Project Architecture', border: 'border-purple-500', bg: 'bg-purple-50/70', tag: 'text-purple-700' };
      default:
        return { label: 'General', border: 'border-slate-400', bg: 'bg-slate-50', tag: 'text-slate-600' };
    }
  };

  const handleCopyAll = () => {
    const text = (interviewQuestions || [])
      .map(
        (q, idx) => `Q${idx + 1}: ${q.question}
Category: ${q.category}
Context: ${q.context}
Recommended Talking Points:
${(q.keyTalkingPoints || []).map((tp) => `- ${tp}`).join('\n')}
What to Avoid: ${q.whatToAvoid}
`
      )
      .join('\n---\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Interview Prep & Technical Defense
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Role-targeted questions derived directly from your resume and requirements for{' '}
            <strong className="text-slate-800">{targetRole}</strong> {targetCompany ? `at ${targetCompany}` : ''}.
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
          <span>{copied ? 'Copied All' : 'Copy All Questions'}</span>
        </button>
      </div>

      {/* High Density Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Questions' : cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* High Density Left-Bordered Question Cards */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => {
          const catInfo = getCategoryLabel(q.category);
          const isExpanded = expandedIdx === idx;

          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Question Summary Bar */}
              <div
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className={`p-4 border-l-4 ${catInfo.border} flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${catInfo.tag}`}>
                      {catInfo.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Q{idx + 1}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    Context: {q.context}
                  </p>
                </div>

                <div className="pt-1 text-slate-400">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Key Talking Points */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                        Recommended Talking Points (STAR)
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {(q.keyTalkingPoints || []).map((tp, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{tp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What to Avoid */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-2">
                        Traps & What to Avoid
                      </span>
                      <div className="flex items-start gap-1.5 text-xs text-slate-700 bg-red-50/50 p-2.5 rounded border border-red-100">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{q.whatToAvoid}</span>
                      </div>

                      {q.sampleGoodAnswer && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                            Model STAR Response
                          </span>
                          <p className="text-xs text-slate-700 italic font-mono leading-relaxed bg-blue-50/40 p-2 rounded border border-blue-100">
                            "{q.sampleGoodAnswer}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Notes Box */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      My Scratchpad Notes for this Question:
                    </span>
                    <textarea
                      value={notes[idx] || ''}
                      onChange={(e) => setNotes({ ...notes, [idx]: e.target.value })}
                      placeholder="Type your talking points or past metrics here..."
                      rows={2}
                      className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
