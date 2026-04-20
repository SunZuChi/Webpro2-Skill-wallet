"use client";

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

export const Achivement = ({ onViewAll }: { onViewAll: () => void }) => {return (
    
                <div className="xl:col-span-5 bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col min-h-[480px] shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-left">
                      <h3 className="text-xl font-bold">Recent Achievements</h3>
                      <p className="text-xs text-slate-500 mt-1">Your latest verified badges</p>
                    </div>
                    <button onClick={onViewAll}className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all">
                      View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
    
                  {/* List items */}
                  <div className="space-y-4 flex-1">
                    {/* Pending */}
                    <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#ff4f40]/20 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/5 px-2.5 py-1 rounded-md uppercase border border-blue-400/10">Software / Web</span>
                        <div className="flex items-center gap-1.5 text-yellow-500 text-[10px] font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                           <Clock size={12} /> Pending
                        </div>
                      </div>
                      <h4 className="font-bold text-lg text-left group-hover:text-[#ff4f40] transition-colors">Simple HTML Profile Page</h4>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <p>Verified by Prof. Wittawin</p>
                        <span className="uppercase font-bold text-slate-600">Submitted 2h ago</span>
                      </div>
                    </div>
    
                    {/* Revisions */}
                    <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-rose-500/20 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/5 px-2.5 py-1 rounded-md uppercase border border-blue-400/10">Software / Web</span>
                        <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                           <RotateCcw size={12} /> Revisions
                        </div>
                      </div>
                      <h4 className="font-bold text-lg text-left">Advanced React Component</h4>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <p>Verified by Prof. Wittawin</p>
                        <span className="uppercase font-bold text-slate-600">Feb 24, 2026</span>
                      </div>
                    </div>
    
                    {/* Approved */}
                    <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-emerald-500/20 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/5 px-2.5 py-1 rounded-md uppercase border border-emerald-400/10">Game / Graphics</span>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                           <ShieldCheck size={12} /> Approved
                        </div>
                      </div>
                      <h4 className="font-bold text-lg text-left">Basic App Wireframe (Figma)</h4>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <p>Verified by Prof. Wittawin</p>
                        <span className="uppercase font-bold text-slate-600">Feb 2, 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              
    
);}