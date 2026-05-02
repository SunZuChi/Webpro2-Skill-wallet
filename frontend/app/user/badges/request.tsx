"use client";

import React, { useState, useRef, useCallback } from 'react';
import {
  Clock,
  ShieldCheck,
  X,
  MessageSquare,
  Upload,
  ChevronDown,
  FileArchive,
  FileText,
} from 'lucide-react';

// Badge options per category
const BADGE_OPTIONS: Record<string, string[]> = {
  software: [
    "Simple HTML Profile Page",
    "Basic Backend (Node.js)",
    "React Components Mastery",
    "REST API with Express",
    "Full-Stack Next.js App",
  ],
  data: [
    "Basic SQL SELECT Queries",
    "Neural Network Basics",
    "Data Visualization with Python",
    "ML Model Training & Evaluation",
    "Database Schema Design",
  ],
  cyber: [
    "Network Security v1",
    "Basic Penetration Testing",
    "Firewall Configuration",
    "SSL/TLS Implementation",
    "OWASP Top 10 Awareness",
  ],
  game: [
    "Basic App Wireframe (Figma)",
    "Unity 2D Game Prototype",
    "3D Asset Modeling (Blender)",
    "Game UI/UX Design",
    "Shader Programming Basics",
  ],
};

const CATEGORIES = [
  { id: 'software', label: 'SOFTWARE / WEB', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'data', label: 'DATA / AI', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { id: 'cyber', label: 'CYBER / NETWORK', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { id: 'game', label: 'GAME / GRAPHICS', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

// ── Upload types ──
interface UploadedFile {
  file: File;
  id: string;
}

export const RequestModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [category, setCategory] = useState('software');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [evidence, setEvidence] = useState('');
  const [badgeDropdownOpen, setBadgeDropdownOpen] = useState(false);

  // ── Upload state ──
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return ['.zip', '.pdf'].includes(ext) && f.size <= 50 * 1024 * 1024;
    });
    setUploadedFiles((prev) => [
      ...prev,
      ...valid.map((f) => ({ file: f, id: crypto.randomUUID() })),
    ]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (id: string) =>
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  // ── End upload logic ──

  // Reset badge when category changes
  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    setSelectedBadge('');
    setBadgeDropdownOpen(false);
  };

  const currentCat = CATEGORIES.find(c => c.id === category)!;
  const badges = BADGE_OPTIONS[category] ?? [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal — bottom sheet on mobile, centered on sm+ */}
      <div className="relative w-full sm:max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-t-4xl sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        {/* ── HEADER ── */}
        <div className="px-5 sm:px-10 py-5 sm:py-8 border-b border-white/5 bg-[#0f0f11] flex flex-col gap-4 sm:gap-6">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">

              {/* Category selector */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${category === cat.id
                      ? `${cat.bg} ${cat.color} border`
                      : 'bg-white/5 border-white/5 text-slate-600 hover:text-slate-300'
                      }`}
                  >
                    {/* Short on mobile */}
                    <span className="sm:hidden">
                      {cat.id === 'software' ? 'WEB' :
                        cat.id === 'data' ? 'AI' :
                          cat.id === 'cyber' ? 'CYBER' : 'GAME'}
                    </span>
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Badge title dropdown */}
              <div className="relative">
                <button
                  onClick={() => setBadgeDropdownOpen(!badgeDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 bg-transparent border-b-2 border-white/10 hover:border-[#ff4f40]/50 focus:border-[#ff4f40] outline-none py-2 text-left transition-colors group"
                >
                  <span className={`text-xl sm:text-3xl font-bold tracking-tight truncate ${selectedBadge ? 'text-white' : 'text-slate-700'}`}>
                    {selectedBadge || 'Select Badge Title...'}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-600 group-hover:text-white transition-all duration-200 ${badgeDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown list */}
                {badgeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in slide-in-from-top-2 duration-150">
                    {badges.map((badge, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedBadge(badge); setBadgeDropdownOpen(false); }}
                        className={`w-full text-left px-5 py-3.5 text-sm font-semibold transition-colors flex items-center justify-between group/item border-b border-white/5 last:border-0 ${selectedBadge === badge
                          ? `${currentCat.color} bg-white/5`
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <span>{badge}</span>
                        {selectedBadge === badge && (
                          <div className={`w-1.5 h-1.5 rounded-full ${currentCat.color.replace('text-', 'bg-')}`} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Student info pill */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-600 flex items-center justify-center text-[7px] sm:text-[8px] font-bold">YR</div>
                  <span className="text-xs sm:text-sm font-bold text-slate-300">
                    Yosapart R. <span className="text-slate-500 ml-1 font-normal">ID: 000001</span>
                  </span>
                </div>
                <div className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${currentCat.bg} ${currentCat.color}`}>
                  {currentCat.label}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="cursor-pointer p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors shrink-0 mt-1"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 sm:py-10 space-y-8 sm:space-y-10 custom-scrollbar">

          {/* Evidence */}
          <section className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-3 text-white">
              <MessageSquare size={18} className="text-[#ff4f40]" /> Your Evidence & Note
            </h3>
            <div className="bg-[#0f0f11] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6">
              <textarea
                placeholder="เขียนคำบรรยายหรือแนบลิงก์โครงการที่นี่เพื่อให้อาจารย์ตรวจสอบ..."
                className="w-full bg-black border border-white/15 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-sm min-h-25 sm:min-h-30 outline-none focus:border-[#ff4f40]/50 transition-all placeholder:text-slate-700 font-medium leading-relaxed text-white resize-none"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
              />

              {/* ── UPLOAD AREA (functional) ── */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.pdf"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-5 sm:p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group ${isDragging
                    ? 'border-[#ff4f40]/60 bg-[#ff4f40]/5'
                    : 'border-white/5 hover:bg-white/2 hover:border-[#ff4f40]/20'
                  }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'text-[#ff4f40]' : 'text-slate-500 group-hover:text-[#ff4f40]'}`}>
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-xs sm:text-sm text-slate-300">
                    {isDragging ? 'Drop files here' : 'Upload Project Artifacts (.zip, .pdf)'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Max file size: 50MB</p>
                </div>
              </div>

              {/* File list */}
              {uploadedFiles.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {uploadedFiles.map(({ file, id }) => (
                    <li key={id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/5">
                      <div className="text-[#ff4f40]/70 shrink-0">
                        {file.name.endsWith('.pdf') ? <FileText size={15} /> : <FileArchive size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 font-semibold truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{formatSize(file.size)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(id); }}
                        className="text-slate-600 hover:text-slate-300 transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {/* ── END UPLOAD AREA ── */}

            </div>
          </section>

          {/* Criteria info */}
          <section className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-3 text-white">
              <ShieldCheck size={18} className="text-[#ff4f40]" /> Expected Evaluation Criteria
            </h3>
            <div className="border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0f0f11]">
              <div className="p-5 sm:p-8 flex gap-4 sm:gap-5 items-start">
                <div className="mt-1 shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-700 flex items-center justify-center">
                  <Clock size={12} className="text-slate-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-lg">Standard Verification Process</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Your professor will evaluate your submission based on technical accuracy, code quality, and alignment with the track objectives.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-5 sm:px-10 py-4 sm:py-8 border-t border-white/5 bg-[#0f0f11] flex items-center justify-end gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-slate-500 font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!selectedBadge}
            className="cursor-pointer px-7 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ff4f40] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs hover:bg-[#e53e30] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4f40]/20 active:scale-95"
          >
            Send Request
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};