import React, { useState } from 'react';
import {
  X,
  FileText,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Download,
  Eye,
  AlignLeft,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  fileUrl: string | null;
  extractedText: string;
  fileName: string;
  detectedSections?: string[];
  fileType?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  file,
  fileUrl,
  extractedText,
  fileName,
  detectedSections = [],
  fileType = 'Document',
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'formatted' | 'raw'>('formatted');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('sm');

  if (!isOpen) return null;

  const isPdf = file?.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const isDocx = fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc');

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOriginal = () => {
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (extractedText) {
      const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\.[^/.]+$/, '')}_extracted.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Filter text when searching
  const filteredLines = extractedText.split('\n').filter((line) => {
    if (!searchQuery.trim()) return true;
    return line.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-[240px] sm:max-w-md">
                  {fileName || 'Uploaded Resume'}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {fileType}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {extractedText.length} characters • {extractedText.split(/\s+/).filter(Boolean).length} words
                {file?.size ? ` • ${(file.size / 1024).toFixed(1)} KB` : ''}
              </p>
            </div>
          </div>

          {/* Center Tabs: Visual vs Formatted vs Raw */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {isPdf && fileUrl && (
              <button
                onClick={() => setActiveTab('visual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'visual'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PDF Document</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('formatted')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'formatted'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Formatted Paper View</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ATS Extracted Text</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
              title="Copy extracted resume text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px]">Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadOriginal}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors shadow-2xs cursor-pointer"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secondary Viewer Control Toolbar (when in formatted or raw view) */}
        {activeTab !== 'visual' && (
          <div className="px-5 py-2 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            {/* Search Input */}
            <div className="flex items-center gap-2 max-w-xs w-full">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-blue-500"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Font / Zoom Controls */}
            <div className="flex items-center gap-3 text-slate-500">
              {activeTab === 'formatted' && (
                <div className="flex items-center gap-1 text-[11px]">
                  <span>Size:</span>
                  {(['sm', 'base', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] cursor-pointer ${
                        fontSize === sz
                          ? 'bg-blue-100 text-blue-700 font-extrabold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1 font-semibold">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Main Content Body */}
        <div className="flex-1 bg-slate-100/70 overflow-auto p-4 sm:p-6 flex justify-center">
          {/* 1. VISUAL PDF VIEWER (Direct Native Browser PDF Rendering) */}
          {activeTab === 'visual' && isPdf && fileUrl ? (
            <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-slate-300 bg-slate-800">
              <object
                data={fileUrl}
                type="application/pdf"
                className="w-full h-full border-none rounded-xl"
                title="PDF Document Viewer"
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-300 bg-slate-800 space-y-3">
                  <FileText className="w-12 h-12 text-slate-400" />
                  <p className="text-sm font-bold text-white">PDF Document Loaded</p>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    Your browser does not support inline PDF plugins for local blobs. You can view the formatted paper version or download the file.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setActiveTab('formatted')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      View Formatted Paper View
                    </button>
                    <button
                      onClick={handleDownloadOriginal}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-xs cursor-pointer"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </object>
            </div>
          ) : null}

          {/* 2. FORMATTED RESUME VIEW (Styled like a real paper resume document) */}
          {activeTab === 'formatted' || (activeTab === 'visual' && (!isPdf || !fileUrl)) ? (
            <div
              style={{ zoom: `${zoomLevel}%` }}
              className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-slate-200 p-8 sm:p-12 transition-all duration-150 self-start"
            >
              {/* Document Paper Header */}
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h1 className="text-xl font-bold text-slate-900 font-serif tracking-tight">
                  {fileName.replace(/\.[^/.]+$/, '')}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-blue-600">{fileType.toUpperCase()} Format</span>
                  <span>•</span>
                  <span>Extracted via High-Density ResumeSense Engine</span>
                </div>
                {detectedSections.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {detectedSections.map((sec, i) => (
                      <span
                        key={i}
                        className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Formatted Text Content */}
              <div
                className={`space-y-4 text-slate-800 font-serif leading-relaxed ${
                  fontSize === 'sm' ? 'text-xs leading-5' : fontSize === 'base' ? 'text-sm leading-6' : 'text-base leading-7'
                }`}
              >
                {filteredLines.map((line, idx) => {
                  const trimmed = line.trim();
                  if (!trimmed) {
                    return <div key={idx} className="h-2" />;
                  }

                  // Detect headings
                  const isHeading =
                    detectedSections.some(
                      (sec) =>
                        trimmed.toLowerCase() === sec.toLowerCase() ||
                        trimmed.toLowerCase().startsWith(sec.toLowerCase() + ':')
                    ) ||
                    (trimmed === trimmed.toUpperCase() && trimmed.length < 30 && trimmed.length > 3);

                  if (isHeading) {
                    return (
                      <h2
                        key={idx}
                        className="text-sm font-bold text-slate-900 uppercase tracking-wider pt-3 pb-1 border-b border-slate-200 font-sans"
                      >
                        {trimmed}
                      </h2>
                    );
                  }

                  // Detect bullet points
                  const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');

                  return (
                    <p
                      key={idx}
                      className={
                        isBullet
                          ? 'pl-4 text-slate-700 relative before:content-["•"] before:absolute before:left-0 before:text-blue-500'
                          : 'text-slate-800'
                      }
                    >
                      {isBullet ? trimmed.replace(/^[•\-*]\s*/, '') : trimmed}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* 3. RAW ATS EXTRACTED TEXT (Monospace editor / parser inspector) */}
          {activeTab === 'raw' ? (
            <div
              style={{ zoom: `${zoomLevel}%` }}
              className="w-full max-w-4xl bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 self-start text-slate-100 font-mono text-xs overflow-x-auto"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400 text-[11px]">
                <span>RAW PARSED TEXT BUFFER ({filteredLines.length} lines)</span>
                <span className="text-emerald-400 font-semibold">Ready for ATS Tokenization</span>
              </div>
              <div className="space-y-1 leading-5 select-text">
                {filteredLines.map((line, i) => (
                  <div key={i} className="flex gap-4 hover:bg-slate-800/60 px-1 py-0.5 rounded">
                    <span className="text-slate-600 select-none w-8 text-right shrink-0">{i + 1}</span>
                    <span className="text-slate-200 break-words whitespace-pre-wrap flex-1">{line || ' '}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Document loaded & verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
