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

export const Achivement = ({ onViewAll, badges = [], feedbacks = [] }: { onViewAll: () => void; badges?: any[]; feedbacks?: any[] }) => {
  // Combine badges and feedbacks
  const allItems = [
    ...badges.map(b => ({
        id: b.badge_id + '_appr',
        name: b.badge_name,
        category: b.skill || b.category || 'Unknown',
        status: 'approved',
        verifier: b.verification?.verifier_name || 'System',
        date: new Date(b.issued_at || new Date()),
    })),
    ...feedbacks.map(f => ({
        id: f.feedback_id,
        name: f.badge_name,
        category: f.skill || f.category || 'Unknown',
        status: f.status, // 'pending', 'rejected'
        verifier: f.verifier_name || 'Pending',
        date: new Date(f.updated_at || f.created_at || new Date()),
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3); // Take top 3 recent

  return (
    <div className="xl:col-span-5 bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col min-h-[480px] shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h3 className="text-xl font-bold">Recent Achievements</h3>
          <p className="text-xs text-slate-500 mt-1">Your latest verified badges & requests</p>
        </div>
        <button onClick={onViewAll} className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all">
          View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* List items */}
      <div className="space-y-4 flex-1">
        {allItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No recent achievements or requests yet.
          </div>
        ) : (
          allItems.map((item, index) => {
            const isApproved = item.status === 'approved';
            const isPending = item.status === 'pending';
            const isRejected = item.status === 'rejected';

            let statusColor = '';
            let statusBg = '';
            let Icon = ShieldCheck;
            let statusText = 'Approved';

            if (isPending) {
              statusColor = 'text-yellow-500';
              statusBg = 'bg-yellow-500/10 border-yellow-500/20';
              Icon = Clock;
              statusText = 'Pending';
            } else if (isRejected) {
              statusColor = 'text-rose-500';
              statusBg = 'bg-rose-500/10 border-rose-500/20';
              Icon = RotateCcw;
              statusText = 'Revisions';
            } else {
              statusColor = 'text-emerald-500';
              statusBg = 'bg-emerald-500/10 border-emerald-500/20';
              Icon = ShieldCheck;
              statusText = 'Approved';
            }

            return (
              <div key={item.id + index} className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-400/5 px-2.5 py-1 rounded-md uppercase border border-blue-400/10">
                    {item.category}
                  </span>
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border ${statusColor} ${statusBg}`}>
                     <Icon size={12} /> {statusText}
                  </div>
                </div>
                <h4 className="font-bold text-lg text-left">{item.name}</h4>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <p>{isPending ? 'Awaiting Verification' : `Verified by ${item.verifier}`}</p>
                  <span className="uppercase font-bold text-slate-600">
                    {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};