"use client";

import React, { useState } from 'react';
import { AlignLeft } from 'lucide-react';
import { Sidebar } from './sidebar';
import { Achivement } from './achivement';
import { FeedbackPage } from './feeedback';
import { MatrixPage } from './matrix';

export const OverviewPage = ({ onLogout, onViewAll }: { onLogout?: () => void; onViewAll?: () => void }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">

      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative flex flex-col transition-all duration-300 pt-14 md:pt-0">

        {/* Header — hidden on mobile (top bar replaces it) */}
        <header className="hidden md:flex h-17.5 md:h-22.5 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 items-center shrink-0">
          <div className={containerClass}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Overview</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome + Content */}
        <div className={`${containerClass} py-6 sm:py-8 md:py-10 space-y-6 md:space-y-8 lg:space-y-10`}>
          <div className="text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Welcome back, Yosapart!</h2>
            <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest sm:tracking-[0.12em] font-bold leading-relaxed">
              YOU'VE SUCCESSFULLY UNLOCKED{' '}
              <span className="text-blue-500 font-extrabold underline decoration-blue-500/30 underline-offset-4">
                8 VERIFIED CREDENTIALS
              </span>
              , READY TO STAND OUT IN THE TECH INDUSTRY.
            </p>
          </div>

          {/* Grid: Matrix + Achievements */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
            <MatrixPage />
            <Achivement onViewAll={onViewAll ?? (() => { })} />
          </div>

          <FeedbackPage />
        </div>

        <footer className="mt-auto p-8 md:p-10 text-center opacity-30">
          <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Ip&s IT Portfolio & Skill © 2026</p>
        </footer>
      </main>

    </div>
  );
};