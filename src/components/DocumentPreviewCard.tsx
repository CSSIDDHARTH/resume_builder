import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Maximize2,
  Copy,
  Check,
  AlignLeft,
  Layers,
  Sparkles,
  Download,
  Trash2,
} from 'lucide-react';

interface DocumentPreviewCardProps {
  fileName: string;
  fileType: string;
  fileSize?: number;
  extractedText: string;
  detectedSections?: string[];
  fileUrl: string | null;
  file: File | null;
  onOpenFullscreenModal: () => void;
  onClearFile?: () => void;
}

export const DocumentPreviewCard: React.FC<DocumentPreviewCardProps> = ({
  fileName,
  fileType,
  fileSize,
  extractedText,
  detectedSections = [],
  fileUrl,
  file,
  onOpenFullscreenModal,
  onClearFile,
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual');
  const [copied, setCopied] = useState<boolean>(false);

  const isPdf = file?.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const wordCount = extractedText.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs block">
                {fileName}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                {fileType}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{extractedText.length} chars</span>
              {fileSize && (
                <>
                  <span>•</span>
                  <span>{(fileSize / 1024).toFixed(1)} KB</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
            {isPdf && fileUrl && (
              <button
                type="button"
                onClick={() => setViewMode('visual')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === 'visual'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Document View</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'text' || (!isPdf && viewMode === 'visual')
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <AlignLeft className="w-3 h-3" />
              <span>Extracted Text</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
            title="Copy extracted text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onOpenFullscreenModal}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
            title="Open fullscreen document viewer"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Expand Viewer</span>
          </button>

          {onClearFile && (
            <button
              type="button"
              onClick={onClearFile}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Remove file"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Embedded Document View Body */}
      <div className="relative">
        {/* 1. VISUAL PDF VIEWER */}
        {viewMode === 'visual' && isPdf && fileUrl ? (
          <div className="w-full h-80 bg-slate-800 relative">
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-full border-none"
              title="Document Preview"
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 bg-slate-800">
                <FileText className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-white">PDF Document Loaded</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Click below to open the interactive document viewer.
                </p>
                <button
                  type="button"
                  onClick={onOpenFullscreenModal}
                  className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Open Document Viewer
                </button>
              </div>
            </object>
            <div className="absolute bottom-2 right-2">
              <button
                type="button"
                onClick={onOpenFullscreenModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold backdrop-blur-xs shadow-md transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fullscreen View</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* 2. EXTRACTED TEXT OR NON-PDF PREVIEW */}
        {(viewMode === 'text' || !isPdf || !fileUrl) ? (
          <div className="p-3 bg-slate-50/50">
            {detectedSections.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Detected Sections:
                </span>
                {detectedSections.map((sec, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium shadow-2xs"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            )}
            <textarea
              readOnly
              value={extractedText}
              rows={8}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800 font-mono focus:outline-blue-500"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
