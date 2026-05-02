"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ShieldCheck, 
  X,
  MessageSquare,
  Upload,
  Badge as BadgeIcon,
  Loader2
} from 'lucide-react';
import { BadgeService } from '../../../services/badge.service';
import { auth } from '../../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';



export const RequestModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [badges, setBadges] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [requestData, setRequestData] = useState({
    title: '',
    category: 'SOFTWARE / WEB',
    evidence: '',
    file: null as File | null
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      BadgeService.getAllBadges().then(res => {
        if (res.status === 'success') {
          setBadges(res.data);
        } else {
          setBadges([{ id: "error", name: "Error fetching from backend: " + JSON.stringify(res), category: requestData.category }]);
        }
      }).catch(err => {
        setBadges([{ id: "error", name: "Fetch Error: " + err.message, category: requestData.category }]);
      });
    }

    // ดึงข้อมูลจาก Local Storage Token ถ้ามี
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

  // กรองตามหมวดหมู่ที่เลือก (แถบด้านขวา)
  const filteredBadges = badges.filter(b => b.category === requestData.category);
  const selectedBadge = badges.find(b => b.id === requestData.title);

  const handleSubmit = async () => {
    if (!selectedBadge) return alert("Please select a badge title first!");
    if (!requestData.evidence) return alert("Please provide evidence or description!");

    setSubmitting(true);

    let evidence_link = "";

    // ถ้ามีไฟล์แนบ ให้ upload ผ่าน Backend (ไม่มีปัญหา CORS)
    if (requestData.file) {
      const uploadRes = await BadgeService.uploadEvidence(requestData.file);
      if (uploadRes.status === "success" && uploadRes.url) {
        evidence_link = uploadRes.url;
        console.log("File uploaded via backend:", evidence_link);
      } else {
        console.warn("File upload failed, submitting without file.", uploadRes);
      }
    }

    // คำนวณคะแนนรวมจาก criteria_template
    const max_score = selectedBadge?.criteria_template?.reduce((sum: number, c: any) => sum + (c.max_score || 0), 0) || 0;

    const payload = {
      badge_id: selectedBadge.id,
      badge_name: selectedBadge.name,
      category: selectedBadge.category,
      description: requestData.evidence,
      evidence_link: evidence_link, // URL จาก Firebase Storage (หรือ "" ถ้าไม่มีไฟล์)
      criteria: selectedBadge.criteria_template || [],
      max_score: max_score
    };

    const res = await BadgeService.createRequest(payload);
    setSubmitting(false);

    if (res.status === "success") {
      alert("Badge request submitted successfully!");
      onClose(); // ปิด Modal
    } else {
      alert("Failed to submit request.");
    }
  };

  if (!isOpen) return null;

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
                    value={requestData.title}
                    onChange={(e) => {
                      setRequestData({...requestData, title: e.target.value});
                    }}
                  >
                    <option value="" disabled className="bg-[#0f0f11] text-white text-lg">
                      Select Badge Title...
                    </option>
                    {filteredBadges.map(b => (
                      <option key={b.id} value={b.id} className="bg-[#0f0f11] text-white text-lg">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-3">
                   <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[8px] font-bold">
                        {currentUser?.displayName ? currentUser.displayName.substring(0, 2).toUpperCase() : 'YR'}
                      </div>
                      <span className="text-sm font-bold text-slate-300">
                        {currentUser?.displayName || 'Yosapart R.'} 
                        <span className="text-slate-500 ml-2 font-normal">
                          ID: {currentUser?.uid || '000001'}
                        </span>
                      </span>
                   </div>
                   <select 
                    className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2 text-slate-400 text-sm outline-none focus:border-[#ff4f40]/30 cursor-pointer"
                    value={requestData.category}
                    onChange={(e) => setRequestData({...requestData, category: e.target.value, title: ''})}
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
                className="w-full bg-black border border-white/15 rounded-2xl p-6 text-sm min-h-[120px] outline-none focus:border-[#ff4f40]/50 transition-all placeholder:text-slate-700 italic font-light leading-relaxed"
                value={requestData.evidence}
                onChange={(e) => setRequestData({...requestData, evidence: e.target.value})}
              />
              
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/[0.02] hover:border-[#ff4f40]/20 transition-all cursor-pointer group relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setRequestData({...requestData, file: e.target.files[0]});
                    }
                  }}
                />
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-500 group-hover:text-[#ff4f40] transition-colors">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  {requestData.file ? (
                    <p className="font-bold text-sm text-[#ff4f40]">{requestData.file.name}</p>
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
            
            <div className="border border-white/5 rounded-3xl overflow-hidden bg-[#0f0f11] divide-y divide-white/5">
               {selectedBadge?.criteria_template ? (
                 selectedBadge.criteria_template.map((criteria: any, idx: number) => (
                   <div key={idx} className="p-6 sm:p-8 flex gap-5 items-start">
                      <div className="mt-1 shrink-0 w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center">
                         <Clock size={14} className="text-slate-500" />
                      </div>
                      <div>
                         <h4 className="font-bold text-white text-lg">
                            {criteria.name}
                         </h4>
                         <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                            {criteria.description}
                         </p>
                      </div>
                   </div>
                 ))
               ) : (
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
            disabled={submitting}
            className="cursor-pointer px-10 py-4 rounded-2xl bg-[#ff4f40] text-white font-bold uppercase tracking-[0.15em] text-xs hover:bg-[#e53e30] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4f40]/20 transform active:scale-95 disabled:opacity-50"
          >
             {submitting ? "SENDING..." : "SEND REQUEST"}
          </button>
        </div>

      </div>
    </div>
  );
};