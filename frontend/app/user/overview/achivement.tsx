"use client";

import React from 'react';
import {
  Clock,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { BadgeRequest } from '../../../services/overview.service';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// แมป category -> สี badge
const categoryColorClass: Record<string, string> = {
  'SOFTWARE / WEB': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'DATA / AI': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  'CYBER / NETWORK': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  'GAME / GRAPHICS': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};

export const Achivement = ({ requests, loading, onViewAll }: { requests: BadgeRequest[]; loading: boolean; onViewAll?: () => void }) => {
  return (

    <div className="xl:col-span-5 bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col min-h-[480px] shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h3 className="text-xl font-bold">Recent Achievements</h3>
          <p className="text-xs text-slate-500 mt-1">Your latest verified badges</p>
        </div>
        <button onClick={onViewAll} className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all">
          View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* List items */}
      <div className="space-y-4 flex-1">
        {loading ? (
          // Skeleton เหมือน design เดิม
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="h-5 w-24 bg-white/5 rounded-md" />
                <div className="h-5 w-20 bg-white/5 rounded-full" />
              </div>
              <div className="h-5 w-48 bg-white/5 rounded-md" />
              <div className="flex justify-between">
                <div className="h-3 w-32 bg-white/5 rounded" />
                <div className="h-3 w-20 bg-white/5 rounded" />
              </div>
            </div>
          ))
        ) : requests.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-3">
            <ShieldCheck size={28} className="text-slate-700" />
            <p className="text-slate-500 text-sm">No badge requests yet.</p>
          </div>
        ) : (
          requests.map((req) => {
            const catKey = (req.category || '').toUpperCase().trim();
            const catColor = categoryColorClass[catKey] || 'text-slate-400 bg-slate-400/5 border-slate-400/10';
            return (
              <div key={req.id} className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border ${catColor}`}>
                    {req.category || 'General'}
                  </span>
                  {req.status === 'pending' && (
                    <div className="flex items-center gap-1.5 text-yellow-500 text-[10px] font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                      <Clock size={12} /> Pending
                    </div>
                  )}
                  {req.status === 'revision' && (
                    <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                      <RotateCcw size={12} /> Revisions
                    </div>
                  )}
                  {req.status === 'approved' && (
                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <ShieldCheck size={12} /> Approved
                    </div>
                  )}
                  {req.status === 'rejected' && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold bg-slate-500/10 px-3 py-1 rounded-full border border-slate-500/20">
                      <RotateCcw size={12} /> Rejected
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-lg text-left">{req.badge_name}</h4>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <p>{req.verifier_id ? 'Verified by Prof.' : 'Awaiting Review'}</p>
                  <span className="uppercase font-bold text-slate-600">{formatDate(req.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>


  );
}