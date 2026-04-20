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

export const MatrixPage = () => {return(
    
            <div className="xl:col-span-7 bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center relative min-h-[480px] shadow-2xl shadow-black/50">
               <div className="absolute top-10 left-10 text-left">
                  <h3 className="text-xl font-bold">Skill Matrix Analytics</h3>
                  <p className="text-xs text-slate-500 mt-1">Proficiency based on completed tracks</p>
               </div>
               
               {/* Radar Chart SVG Simulation */}
               <div className="relative mt-12">
                  <svg width="340" height="340" viewBox="0 0 100 100" className="opacity-20 animate-pulse">
                    {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                      <circle key={i} cx="50" cy="50" r={45 * r} fill="none" stroke="white" strokeWidth="0.2" />
                    ))}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.2" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.2" />
                  </svg>
                  <svg width="340" height="340" viewBox="0 0 100 100" className="absolute inset-0">
                    <polygon points="50,18 75,50 50,78 35,50" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="0.8" className="animate-in zoom-in duration-1000" />
                    <circle cx="50" cy="18" r="1.2" fill="#3b82f6" />
                    <circle cx="75" cy="50" r="1.2" fill="#f43f5e" />
                    <circle cx="50" cy="78" r="1.2" fill="#10b981" />
                    <circle cx="35" cy="50" r="1.2" fill="#eab308" />
                  </svg>
                  
                  {/* Labels */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-400 uppercase text-center leading-tight">SOFTWARE /<br/>WEB</span>
                  <span className="absolute top-1/2 -right-14 -translate-y-1/2 text-[10px] font-bold text-rose-400 uppercase tracking-tighter">DATA / AI</span>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-400 uppercase text-center leading-tight">GAME /<br/>GRAPHICS</span>
                  <span className="absolute top-1/2 -left-16 -translate-y-1/2 text-[10px] font-bold text-yellow-400 uppercase text-center leading-tight">CYBER /<br/>NETWORK</span>
               </div>
            </div>
);}