'use client';
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Medal, 
  FolderOpen, 
  FileUp, 
  Settings, 
  AlignLeft, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Quote, 
  ChevronRight,
  ExternalLink,
  MoreVertical,
  LogOut
} from 'lucide-react';

export const FeedbackPage = () => {return(
 /* 3. Professor Feedback & Activity */
          <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col space-y-8 shadow-2xl shadow-rose-500/5">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-xl font-bold">Professor Feedback & Activity</h3>
                <p className="text-xs text-slate-500 mt-1">Track your evaluation history and comments from faculty</p>
              </div>
              <button className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all">View All
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col gap-4 items-start">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-extrabold bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                    <ShieldCheck size={14} /> Approved
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold tracking-widest">Feb 2, 2026</span>
                </div>
                
                <div className="text-left">
                   <h4 className="text-xl font-bold">Credential Issued: Basic App Wireframe</h4>
                   <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
                     Prof. Wittawin verified your Figma prototype and issued the credential to your wallet.
                   </p>
                </div>

                <div className="bg-[#050505] rounded-[2rem] p-8 border border-white/5 relative group w-full text-left overflow-hidden">
                  <div className="absolute top-6 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Quote size={80} />
                  </div>
                  <div className="flex gap-6 items-start relative z-10">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Professor" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-base text-slate-300 italic font-light leading-relaxed max-w-5xl">
                      "Great attention to detail on the user flows. The wireframes are clean, accessible, and demonstrate a solid understanding of core UX principles. Well done."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
);}

