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
  ExternalLink,
  MoreVertical,
  LogOut
} from 'lucide-react';
import { Sidebar } from './sidebar';
import { Achivement } from './achivement';
import { FeedbackPage } from './feeedback';
import { MatrixPage } from './matrix';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ProfileService } from '../../../services/profile.service';
import { FeedbackService } from '../../../services/feedback.service';

export const OverviewPage = ({ onLogout  , onViewAll}: { onLogout?: () => void; onViewAll?: () => void  }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const [profRes, feedRes] = await Promise.all([
            ProfileService.getMyProfile(token),
            FeedbackService.getMyRequests(token)
          ]);

          setProfileData(profRes);
          setFeedbacks(feedRes.feedbacks || []);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#050505] text-white">Loading...</div>;
  }

  const name = profileData?.profile?.name || 'Student';
  const firstName = name.split(' ')[0];
  const approvedBadges = profileData?.achievements?.badges || [];
  const badgeCount = approvedBadges.length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">
      
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* MAIN CONTENT Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col transition-all duration-300">
        
        {/* Header Title */}
        <header className="h-[70px] md:h-[90px] border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center">
        <div className={containerClass}>
          <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-slate-400"><AlignLeft size={24} /></button>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Overview</h1>
           </div>
           </div>
           </div>
        </header>

        {/* Welcome Text */}
        <div className={`${containerClass} py-8 sm:py-10 space-y-8 md:space-y-10`}>
          <div className="text-left space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Welcome back, {firstName}!</h2>
            <p className="text-sm text-slate-500 uppercase tracking-[0.12em] font-bold">
              YOU'VE SUCCESSFULLY UNLOCKED <span className="text-blue-500 font-extrabold underline decoration-blue-500/30 underline-offset-4">{badgeCount} VERIFIED CREDENTIALS</span>, READY TO STAND OUT IN THE TECH INDUSTRY.
            </p>
          </div>

          {/* Top Row: Analytics & Recent List */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <MatrixPage badges={approvedBadges} />
            <Achivement onViewAll={onViewAll || (() => {})} badges={approvedBadges} feedbacks={feedbacks} />
          </div>
          <FeedbackPage badges={approvedBadges} feedbacks={feedbacks} />  
        </div>
        <footer className="mt-auto p-10 text-center opacity-30">
           <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Ip&s IT Portfolio & Skill © 2026</p>
        </footer>
      </main>
      
    </div>
  );
};
