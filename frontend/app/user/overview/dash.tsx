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
import { Sidebar } from './sidebar';
import { Achivement } from './achivement';
import { FeedbackPage } from './feeedback';
import { MatrixPage } from './matrix';

export const OverviewPage = ({ onLogout  , onViewAll}: { onLogout?: () => void; onViewAll?: () => void  }) => {
  // ⚡️ เพิ่ม State สำหรับจัดการการซ่อนเมนู
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">
      
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* 2. MAIN CONTENT Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col transition-all duration-300">
        
        {/* Header Title */}
        <header className="h-[90px] px-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40">
           <div className="flex items-center gap-4">
              {/* ปุ่ม Hamburger สำหรับ Mobile (แสดงเมื่อจอเล็ก) */}
              <button className="md:hidden p-2 text-slate-400"><AlignLeft size={24} /></button>
              <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors relative">
                 <div className="absolute top-2 right-2 w-2 h-2 bg-[#ff4f40] rounded-full ring-2 ring-[#050505]"></div>
                 <Medal size={18} />
              </button>
           </div>
        </header>

        <div className="p-10 max-w-[1500px] w-full mx-auto space-y-10">
          
          {/* Welcome Text */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Welcome back, Yosapart!</h2>
            <p className="text-sm text-slate-500 uppercase tracking-[0.12em] font-bold">
              YOU'VE SUCCESSFULLY UNLOCKED <span className="text-blue-500 font-extrabold underline decoration-blue-500/30 underline-offset-4">8 VERIFIED CREDENTIALS</span>, READY TO STAND OUT IN THE TECH INDUSTRY.
            </p>
          </div>

          {/* Top Row: Analytics & Recent List */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <MatrixPage />
            <Achivement />
          </div>
          <FeedbackPage />  
        </div>
        <footer className="mt-auto p-10 text-center opacity-30">
           <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Ip&s IT Portfolio & Skill © 2026</p>
        </footer>
      </main>
      
    </div>
  );
};
