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
const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";
  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">
      
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* 2. MAIN CONTENT Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col transition-all duration-300">
        
        {/* Header Title */}
        <header className="h-17.5 md:h-22.5 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center shrink-0">
        <div className={containerClass}>
          <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              {/* ปุ่ม Hamburger สำหรับ Mobile (แสดงเมื่อจอเล็ก) */}
              <button className="md:hidden p-2 text-slate-400"><AlignLeft size={24} /></button>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Overview</h1>
           </div>
           </div>
           </div>
        </header>

        
          
          {/* Welcome Text */}
          <div className={`${containerClass} py-8 sm:py-10 space-y-8 md:space-y-10`}>
          <div className="text-left space-y-2">
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
