"use client";

import React, { useState, useEffect } from 'react';
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
  Plus,
  ExternalLink,
  X,
  FileIcon,
  Download,
  CheckCircle2,
  Menu,
  Bell,
  User,
  MoreVertical,
  MessageSquare,
  Upload,
  Link as LinkIcon,
  Badge
} from 'lucide-react';


import { Sidebar2 } from './sidebar2';
import { RequestModal } from './request';
import { BadgePage } from './badge';
/**
 * [QUERY]: ข้อมูล Badge จำลอง
 */


const CATEGORIES = [
  { id: 'all', label: 'All', color: 'bg-white text-black' },
  { id: 'software', label: 'SOFTWARE / WEB', color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
  { id: 'data', label: 'DATA / AI', color: 'bg-rose-500/10 border-rose-500/20 text-rose-500' },
  { id: 'cyber', label: 'CYBER / NETWORK', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
  { id: 'game', label: 'GAME / GRAPHICS', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
];




// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function MyBadgesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Responsive: Close sidebar on mobile/tablet resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter Logic
  

  const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">
      
     <Sidebar2 isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto flex flex-col transition-all duration-300 relative">
        <div className="absolute top-0 right-0 w-150 h-150 bg-[#ff4f40]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <header className="h-17.5 md:h-22.5 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center shrink-0">
          <div className={containerClass}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white"><Menu size={24} /></button>
                 <h1 className="text-xl md:text-2xl font-bold tracking-tight">My Badges</h1>
              </div>
              
              
              
            </div>
          </div>
        </header>

        <div className={`${containerClass} py-8 sm:py-10 space-y-8 md:space-y-10`}>
          <div className="text-left space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Verified Credentials</h2>
            <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">SHOWCASE YOUR TECHNICAL CAPABILITIES TO FUTURE EMPLOYERS.</p>
          </div>

          

          <BadgePage />
          
        </div>

        <footer className="mt-auto p-10 text-center opacity-30">
           <p className="text-[10px] uppercase font-bold tracking-[0.4em]">Ip&s IT Portfolio & Skill © 2026</p>
        </footer>
      </main>

      

    </div>
  );
}

