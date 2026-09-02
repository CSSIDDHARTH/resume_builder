import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
  Briefcase,
  FileCheck,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { parseResumeFile, analyzeResume } from '../services/api';
import { ResumeAnalysisResult, SavedResume } from '../types';
import { SAMPLE_JOBS, SAMPLE_RESUMES } from '../data/demoData';

interface UploadAnalyzeViewProps {
  onAnalysisComplete: (result: ResumeAnalysisResult) => void;
  savedResumes: SavedResume[];
}

const ANALYSIS_STAGES = [
  'Validating & parsing document format...',
  'Extracting resume sections and career history...',
  'Analyzing target job competencies and keywords...',
  'Performing evidence-based skill cross-matching...',
  'Evaluating bullet points for Action → Task → Result...',
  'Calculating weighted ATS & explainable score metrics...',
  'Finalizing comprehensive intelligence report...',
];

export const UploadAnalyzeView: React.FC<UploadAnalyzeViewProps> = ({
  onAnalysisComplete,
  savedResumes,
}) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeName, setResumeName] = useState<string>('My Resume');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedStats, setParsedStats] = useState<{
    wordCount: number;
    detectedSections: string[];
    fileType: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    setIsParsingFile(true);
    setFileName(file.name);
    setResumeName(file.name.replace(/\.[^/.]+$/, ''));

    try {
      const parsed = await parseResumeFile(file);
      setResumeText(parsed.text);
      setParsedStats({
        wordCount: parsed.wordCount,
        detectedSections: parsed.detectedSections,
        fileType: parsed.fileType,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'We could not extract readable text from this file. Please verify the document format or try a DOCX/TXT file.'
      );
      setFileName(null);
    } finally {
      setIsParsingFile(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      setErrorMessage('Please upload a resume file or paste your resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage('Please provide a target job description or select a role sample.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setCurrentStageIdx(0);

    // Advance stages for real-time visual feedback
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const result = await analyzeResume(resumeText, jobDescription, resumeName);
      clearInterval(interval);
      onAnalysisComplete(result);
    } catch (err: any) {
      clearInterval(interval);
      console.error('Analysis failed', err);
      setErrorMessage(
        err.message || 'Failed to complete analysis. Please verify your input and retry.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSampleJob = (job: typeof SAMPLE_JOBS[0]) => {
    setJobDescription(job.description);
  };

  const handleSelectSampleResume = (sample: typeof SAMPLE_RESUMES[0]) => {
    setResumeText(sample.textContent);
    setResumeName(sample.title);
    setFileName(null);
    setParsedStats({
      wordCount: sample.textContent.split(/\s+/).length,
      detectedSections: ['Summary', 'Experience', 'Skills', 'Education', 'Projects'],
      fileType: 'Sample Template',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Analyze Resume Against Target Job
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Upload PDF, DOCX, or TXT documents for instant ATS parsing, deep keyword auditing, and gap analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Preset Profiles:
          </span>
          {SAMPLE_RESUMES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSampleResume(sample)}
              className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              {sample.title.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Input Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Resume Input */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1. Resume Document (PDF / DOCX / TXT)
              </label>
              {parsedStats && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                  {parsedStats.wordCount} words detected
                </span>
              )}
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-2">
                {isParsingFile ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </div>

              <div className="text-xs font-bold text-slate-800">
                {fileName ? fileName : 'Click to browse or drop file here'}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Supports PDF, DOCX, and TXT files up to 10MB
              </p>
            </div>

            {/* Direct Text Editor / Fallback */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Extracted Resume Text
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {resumeText.length} chars
                </span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your raw resume text directly here..."
                rows={8}
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Target Job Description Input */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                2. Target Job Description
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {jobDescription.length} chars
              </span>
            </div>

            {/* Sample Job Selectors */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Samples:
              </span>
              {SAMPLE_JOBS.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => handleSelectSampleJob(job)}
                  className="text-[11px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors cursor-pointer font-medium"
                >
                  {job.title.split(' ')[0]} ({job.company})
                </button>
              ))}
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting, responsibilities, and qualifications here..."
              rows={12}
              className="w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            {errorMessage && (
              <div className="p-3 mb-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {isAnalyzing && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1.5">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                    <span>{ANALYSIS_STAGES[currentStageIdx]}</span>
                  </span>
                  <span>Stage {currentStageIdx + 1}/{ANALYSIS_STAGES.length}</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{
                      width: `${((currentStageIdx + 1) / ANALYSIS_STAGES.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || isParsingFile}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isAnalyzing ? (
                <span>Executing High-Density Audit...</span>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Run Deep ATS Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
