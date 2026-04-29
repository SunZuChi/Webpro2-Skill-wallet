"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, X, Upload, MessageSquare } from 'lucide-react';
import { auth } from '../../../lib/firebase';
import { BadgeService } from '../../../services/badge.service';
import { ProfileService } from '../../../services/profile.service';
import { FeedbackService } from '../../../services/feedback.service';

export const RequestModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [requestData, setRequestData] = useState({
    badge_id: '',
    category: 'SOFTWARE / WEB',
    evidence: '',
    file: null
  });
  
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // fetch catalog via Service
      BadgeService.getCatalog()
        .then(data => {
           if (data.status === 'success') {
             setCatalog(data.badges || []);
           }
        })
        .catch(err => {
            console.error(err);
            setCatalog([]);
        });
      
      // fetch profile via Service
      auth.onAuthStateChanged(async (user) => {
         if (user) {
             try {
                 const token = await user.getIdToken();
                 const data = await ProfileService.getMyProfile(token);
                 if (data.status === 'success') {
                     setUserProfile(data.profile);
                 }
             } catch(err) {
                 console.error(err);
             }
         }
      });
    }
  }, [isOpen]);

  // Auto-select first badge when category changes or catalog loads
  useEffect(() => {
    const validOptions = (catalog || []).filter(b => b.category === requestData.category);
    
    if (validOptions.length > 0) {
        const isCurrentValid = validOptions.find(b => b.badge_id === requestData.badge_id);
        if (!isCurrentValid) {
            setRequestData(prev => ({ ...prev, badge_id: validOptions[0].badge_id }));
        }
    } else {
        if (requestData.badge_id !== '') {
            setRequestData(prev => ({ ...prev, badge_id: '' }));
        }
    }
  }, [catalog, requestData.category, requestData.badge_id]);

  const handleSubmit = async () => {
    if (!requestData.badge_id || !requestData.evidence.trim()) {
        alert("Please select a badge and provide evidence");
        return;
    }
    setLoading(true);
    try {
        const badge = catalog.find(b => b.badge_id === requestData.badge_id);
        
        const res = await FeedbackService.requestBadge({
            badge_id: badge.badge_id,
            badge_name: badge.badge_name,
            skill: badge.skill,
            level: badge.level,
            category: badge.category,
            evidence: requestData.evidence
        });

        if (res.status === 'success') {
            onClose();
            window.location.reload(); 
        } else {
            alert(`Error: ${res.message}`);
        }
    } catch(err: any) {
        console.error(err);
        alert(err.message || 'Failed to send request');
    } finally {
        setLoading(false);
    }
  }

  if (!isOpen) return null;

  const initials = userProfile?.name ? userProfile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'YR';
  const displayName = userProfile?.name || 'Loading...';
  const uidShort = auth.currentUser?.uid?.substring(0, 6) || '000000';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="cursor-pointer absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-10 border-b border-white/5 flex flex-col gap-6 bg-[#0f0f11]">
          <div className="flex justify-between items-start">
             <div className="space-y-4 flex-1 pr-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <select 
                    className="text-2xl sm:text-3xl font-bold tracking-tight bg-transparent border-b border-white/10 focus:border-[#ff4f40] outline-none py-1 w-full max-w-lg transition-colors text-white"
                    value={requestData.badge_id}
                    onChange={(e) => setRequestData({...requestData, badge_id: e.target.value})}
                  >
                    {filteredCatalog.length === 0 && <option value="" disabled className="bg-[#1a1a1a] text-slate-400">Loading badges...</option>}
                    {filteredCatalog.map(b => (
                        <option key={b.badge_id} value={b.badge_id} className="bg-[#1a1a1a] text-base font-normal">
                            {b.badge_name}
                        </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-3">
                   <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[8px] font-bold">{initials}</div>
                      <span className="text-sm font-bold text-slate-300">{displayName} <span className="text-slate-500 ml-2 font-normal">ID: {uidShort}</span></span>
                   </div>
                   <select 
                    className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2 text-slate-400 text-sm outline-none focus:border-[#ff4f40]/30 cursor-pointer"
                    value={requestData.category}
                    onChange={(e) => setRequestData({...requestData, category: e.target.value})}
                   >
                     <option value="SOFTWARE / WEB">SOFTWARE / WEB</option>
                     <option value="DATA / AI">DATA / AI</option>
                     <option value="CYBER / NETWORK">CYBER / NETWORK</option>
                     <option value="GAME / GRAPHICS">GAME / GRAPHICS</option>
                   </select>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors shrink-0"><X size={28} /></button>
          </div>
        </div>

        {/* Modal Body (Scrollable Form) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 custom-scrollbar">
          
          {/* Section: Your Evidence (Description) */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-white">
              <MessageSquare size={20} className="text-[#ff4f40]" /> Your Evidence & Note
            </h3>
            <div className="bg-[#0f0f11] storke-[#323232] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
              <textarea 
                placeholder="เขียนคำบรรยายหรือแนบลิงก์โครงการที่นี่เพื่อให้อาจารย์ตรวจสอบ... (เช่น ลิงก์ GitHub หรือรายละเอียดของงาน)"
                className="w-full bg-black border border-white/15 rounded-2xl p-6 text-sm min-h-[120px] outline-none focus:border-[#ff4f40]/50 transition-all placeholder:text-slate-700 italic font-light leading-relaxed text-white"
                value={requestData.evidence}
                onChange={(e) => setRequestData({...requestData, evidence: e.target.value})}
              />
              
              {/* File Upload Area */}
              <div 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/[0.02] hover:border-[#ff4f40]/20 transition-all cursor-pointer group"
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                          setRequestData({...requestData, file: e.target.files[0] as any});
                      }
                  }}
                />
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-500 group-hover:text-[#ff4f40] transition-colors">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  {requestData.file ? (
                      <p className="font-bold text-sm text-emerald-500">{(requestData.file as File).name}</p>
                  ) : (
                      <>
                        <p className="font-bold text-sm text-slate-300">Upload Project Artifacts (.zip, .pdf)</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Max file size: 50MB</p>
                      </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Anticipated Criteria (Info Only) */}
          <section className="space-y-6 opacity-100">
            <h3 className="text-lg font-bold flex items-center gap-3 text-white">
              <ShieldCheck size={20} className="text-[#ff4f40]" /> Expected Evaluation Criteria
            </h3>
            <div className="border border-white/5 rounded-3xl overflow-hidden bg-[#0f0f11] flex flex-col">
               {(!catalog.find(b => b.badge_id === requestData.badge_id)?.evaluation_criteria || catalog.find(b => b.badge_id === requestData.badge_id)?.evaluation_criteria.length === 0) ? (
                   <div className="p-6 sm:p-8 flex gap-5 items-start">
                      <div className="mt-1 shrink-0 w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center">
                         <Clock size={14} className="text-slate-500" />
                      </div>
                      <div>
                         <h4 className="font-bold text-white text-lg">Standard Verification Process</h4>
                         <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                            Your professor will evaluate your submission based on technical accuracy, code quality, and alignment with the track objectives.
                         </p>
                      </div>
                   </div>
               ) : (
                   catalog.find(b => b.badge_id === requestData.badge_id)?.evaluation_criteria.map((crit: any, idx: number) => (
                       <div key={idx} className="p-6 sm:p-8 flex gap-5 items-start border-b border-white/5 last:border-0">
                          <div className="mt-1 shrink-0 w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center">
                             <Clock size={14} className="text-[#ff4f40]/80" />
                          </div>
                          <div>
                             <h4 className="font-bold text-white text-lg">{crit.name}</h4>
                             <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                {crit.description}
                             </p>
                          </div>
                       </div>
                   ))
               )}
            </div>
          </section>

        </div>

        {/* Modal Footer (Submit Button) */}
        <div className="p-6 sm:p-10 border-t border-white/5 bg-[#0f0f11] flex flex-col sm:flex-row justify-end gap-4">
          <button 
            onClick={onClose}
            className="cursor-pointer px-8 py-4 rounded-2xl text-slate-500 font-bold uppercase tracking-[0.15em] text-xs hover:text-white transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer px-10 py-4 rounded-2xl bg-[#ff4f40] text-white font-bold uppercase tracking-[0.15em] text-xs hover:bg-[#e53e30] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4f40]/20 transform active:scale-95 disabled:opacity-50"
          >
             {loading ? 'Sending...' : 'Send Request'}
          </button>
        </div>

      </div>
    </div>
  );
};