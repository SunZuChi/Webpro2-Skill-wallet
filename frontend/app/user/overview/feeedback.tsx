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

export const FeedbackPage = ({ badges = [], feedbacks = [] }: { badges?: any[]; feedbacks?: any[] }) => {
  const allItems = [
    ...badges.map(b => ({
      id: b.badge_id + '_appr',
      name: b.badge_name,
      status: 'approved',
      verifier: b.verification?.verifier_name || 'System',
      date: new Date(b.issued_at || new Date()),
      comment: b.comment || `${b.verification?.verifier_name || 'System'} verified your work and issued the credential to your wallet.`
    })),
    ...feedbacks.map(f => ({
      id: f.feedback_id,
      name: f.badge_name,
      status: f.status,
      verifier: f.verifier_name || 'System',
      date: new Date(f.updated_at || f.created_at || new Date()),
      comment: f.comment || (f.status === 'pending' ? 'Your request is currently under review by the faculty.' : 'Please review the feedback and resubmit your work.')
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5); // Show latest 5

  return (
    <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col space-y-8 shadow-2xl shadow-rose-500/5">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-xl font-bold">Professor Feedback & Activity</h3>
          <p className="text-xs text-slate-500 mt-1">Track your evaluation history and comments from faculty</p>
        </div>
        <button className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all">
          View All
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-12">
        {allItems.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-4">No recent activity or feedback available.</div>
        ) : (
          allItems.map((item, idx) => {
            const isApproved = item.status === 'approved';
            const isPending = item.status === 'pending';
            const isRejected = item.status === 'rejected';

            let statusColor = '';
            let statusBg = '';
            let Icon = ShieldCheck;
            let statusText = 'Approved';
            let titleText = `Credential Issued: ${item.name}`;

            if (isPending) {
              statusColor = 'text-yellow-500';
              statusBg = 'bg-yellow-500/10 border-yellow-500/20';
              Icon = Clock;
              statusText = 'Pending';
              titleText = `Request Submitted: ${item.name}`;
            } else if (isRejected) {
              statusColor = 'text-rose-500';
              statusBg = 'bg-rose-500/10 border-rose-500/20';
              Icon = RotateCcw;
              statusText = 'Revisions';
              titleText = `Revisions Requested: ${item.name}`;
            } else {
              statusColor = 'text-emerald-500';
              statusBg = 'bg-emerald-500/10 border-emerald-500/20';
              Icon = ShieldCheck;
              statusText = 'Approved';
              titleText = `Credential Issued: ${item.name}`;
            }

            return (
              <div key={item.id + idx} className="flex flex-col gap-4 items-start border-b border-white/5 pb-8 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 ${statusColor} text-[10px] font-extrabold ${statusBg} px-4 py-1.5 rounded-full border uppercase tracking-widest`}>
                    <Icon size={14} /> {statusText}
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold tracking-widest">
                    {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="text-left">
                   <h4 className="text-xl font-bold">{titleText}</h4>
                   <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
                     {isPending ? 'Your request has been received.' : `Prof. ${item.verifier.replace('Prof. ', '')} evaluated your submission.`}
                   </p>
                </div>

                <div className="bg-[#050505] rounded-[2rem] p-8 border border-white/5 relative group w-full text-left overflow-hidden mt-2">
                  <div className="absolute top-6 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Quote size={80} />
                  </div>
                  <div className="flex gap-6 items-start relative z-10">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl bg-slate-800 flex items-center justify-center">
                      {/* Using a placeholder avatar for now, can be updated to real avatar URL if available */}
                      <span className="text-white font-bold">{item.verifier.charAt(0) === 'P' ? item.verifier.charAt(5) : item.verifier.charAt(0)}</span>
                    </div>
                    <p className="text-base text-slate-300 italic font-light leading-relaxed max-w-5xl">
                      "{item.comment}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

