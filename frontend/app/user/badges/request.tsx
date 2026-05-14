"use client";
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ShieldCheck, 
  X,
  MessageSquare,
  Upload,
  ChevronDown,
  FileText,
  FileArchive,
  Loader2
} from 'lucide-react';
import { BadgeService } from '../../../services/badge.service';
import { auth } from '../../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const RequestModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [badges, setBadges] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; file: File }[]>([]);
  const [badgeDropdownOpen, setBadgeDropdownOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState('SOFTWARE / WEB');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      BadgeService.getAllBadges().then(res => {
        if (res.status === 'success') {
          setBadges(res.data);
        } else {
          setBadges([]);
        }
      }).catch(err => {
        setBadges([]);
      });
      // Reset states
      setEvidence('');
      setUploadedFiles([]);
      setSelectedBadge(null);
      setBadgeDropdownOpen(false);
      setActiveCategory('SOFTWARE / WEB');
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({
          displayName: payload.name || '',
          uid: payload.user_id || payload.uid || '',
          email: payload.email || ''
        });
      } catch (e) {
        console.error("Error decoding token for user info:", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const getCategoryTheme = (category: string) => {
    const cat = (category || '').toUpperCase().trim();
    if (cat === 'SOFTWARE / WEB') {
      return {
        label: 'SOFTWARE / WEB',
        color: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
        bg: 'bg-blue-400/5'
      };
    }
    if (cat === 'DATA / AI') {
      return {
        label: 'DATA / AI',
        color: 'text-rose-400 border-rose-400/20 bg-rose-400/5',
        bg: 'bg-rose-400/5'
      };
    }
    if (cat === 'GAME / GRAPHICS') {
      return {
        label: 'GAME / GRAPHICS',
        color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
        bg: 'bg-emerald-400/5'
      };
    }
    if (cat === 'CYBER / NETWORK') {
      return {
        label: 'CYBER / NETWORK',
        color: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
        bg: 'bg-yellow-400/5'
      };
    }
    return {
      label: 'GENERAL',
      color: 'text-slate-400 border-slate-400/20 bg-slate-400/5',
      bg: 'bg-slate-400/5'
    };
  };

  const currentCat = getCategoryTheme(activeCategory);
  const filteredBadges = badges.filter(b => b.category === activeCategory);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const singleFile = {
      id: Math.random().toString(36).substring(7),
      file: files[0]
    };
    setUploadedFiles([singleFile]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBadge) return alert("Please select a badge title first!");
    if (!evidence) return alert("Please provide evidence or description!");

    setSubmitting(true);

    let evidence_link = "";

    // Upload files sequentially and join their URLs with comma
    if (uploadedFiles.length > 0) {
      const urls: string[] = [];
      for (const item of uploadedFiles) {
        const uploadRes = await BadgeService.uploadEvidence(item.file);
        if (uploadRes.status === "success" && uploadRes.url) {
          urls.push(uploadRes.url);
        }
      }
      evidence_link = urls.join(",");
    }

    // Calculate max score from criteria_template
    const max_score = selectedBadge?.criteria_template?.reduce((sum: number, c: any) => sum + (c.max_score || 0), 0) || 0;

    const payload = {
      badge_id: selectedBadge.id,
      badge_name: selectedBadge.name,
      category: selectedBadge.category,
      description: evidence,
      evidence_link: evidence_link,
      criteria: selectedBadge.criteria_template || [],
      max_score: max_score
    };

    const res = await BadgeService.createRequest(payload);
    setSubmitting(false);

    if (res.status === "success") {
      alert("Badge request submitted successfully!");
      onClose(); // Close Modal
    } else {
      alert("Failed to submit request.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="cursor-pointer absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* ── HEADER ── */}
        <div className="p-6 sm:p-10 pb-6 border-b border-white/5 bg-[#0f0f11] shrink-0">
          <div className="flex flex-col space-y-6">
            
            {/* Row 1: Category Tabs and Close Button */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {['SOFTWARE / WEB', 'DATA / AI', 'CYBER / NETWORK', 'GAME / GRAPHICS'].map((cat) => {
                  const isActive = activeCategory === cat;
                  const theme = getCategoryTheme(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setSelectedBadge(null); // Reset selection
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        isActive
                          ? `${theme.color} border-current bg-white/5`
                          : 'text-slate-500 border-white/5 bg-[#141416]/50 hover:text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onClose}
                className="cursor-pointer p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors shrink-0"
              >
                <X size={22} />
              </button>
            </div>

            {/* Row 2: Badge Title Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBadgeDropdownOpen(!badgeDropdownOpen)}
                className="w-full flex items-center justify-between gap-3 bg-transparent border-b-2 border-white/10 hover:border-[#ff4f40]/50 focus:border-[#ff4f40] outline-none py-2 text-left transition-colors group"
              >
                <span className={`text-xl sm:text-3xl font-bold tracking-tight truncate ${selectedBadge ? 'text-white' : 'text-slate-700'}`}>
                  {selectedBadge ? selectedBadge.name : 'Select Badge Title...'}
                </span>
                <ChevronDown
                  size={24}
                  className={`shrink-0 text-slate-600 group-hover:text-white transition-all duration-200 ${badgeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown list */}
              {badgeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-55 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
                  {filteredBadges.length === 0 ? (
                    <div className="p-5 text-sm text-slate-500">No badges available for this category.</div>
                  ) : (
                    filteredBadges.map((badge, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedBadge(badge); setBadgeDropdownOpen(false); }}
                        className={`w-full text-left px-5 py-3.5 text-sm font-semibold transition-colors flex items-center justify-between group/item border-b border-white/5 last:border-0 ${selectedBadge?.id === badge.id
                          ? 'text-[#ff4f40] bg-white/5'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <span>{badge.name}</span>
                        {selectedBadge?.id === badge.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff4f40]" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Row 3: Student Info Pill and Track Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-600 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white">
                  {currentUser?.displayName ? currentUser.displayName.substring(0, 2).toUpperCase() : 'YR'}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-300">
                  {currentUser?.displayName || 'Student'} <span className="text-slate-500 ml-1 font-normal">ID: {currentUser?.uid ? currentUser.uid.substring(0, 6).toUpperCase() : '000001'}</span>
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${currentCat.bg} ${currentCat.color}`}>
                {currentCat.label}
              </div>
            </div>

          </div>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 sm:py-10 space-y-8 sm:space-y-10 custom-scrollbar bg-[#0a0a0a]">

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
                    <li key={id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[#ff4f40]/70 shrink-0">
                        {file.name.endsWith('.pdf') ? <FileText size={15} /> : <FileArchive size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 font-semibold truncate text-left">{file.name}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5 text-left">{formatSize(file.size)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(id); }}
                        className="text-slate-600 hover:text-slate-300 transition-colors shrink-0 cursor-pointer"
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
            <div className="border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0f0f11] divide-y divide-white/5">
              {selectedBadge?.criteria_template && selectedBadge.criteria_template.length > 0 ? (
                selectedBadge.criteria_template.map((criteria: any, idx: number) => (
                  <div key={idx} className="p-5 sm:p-8 flex gap-4 sm:gap-5 items-start text-left">
                    <div className="mt-1 shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-700 flex items-center justify-center">
                      <Clock size={12} className="text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-lg">{criteria.name}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-medium">
                        {criteria.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 sm:p-8 flex gap-4 sm:gap-5 items-start text-left">
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
              )}
            </div>
          </section>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-5 sm:px-10 py-4 sm:py-8 border-t border-white/5 bg-[#0f0f11] flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-slate-500 font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedBadge || submitting}
            className="cursor-pointer px-7 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ff4f40] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs hover:bg-[#e53e30] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4f40]/20 active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : "Send Request"}
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