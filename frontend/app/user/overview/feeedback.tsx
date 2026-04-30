'use client';
import React from 'react';
import { ShieldCheck, ChevronRight, Quote, MessageSquare } from 'lucide-react';
import { BadgeRequest } from '../../../services/overview.service';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const categoryColor: Record<string, string> = {
  'Software / Web': 'text-blue-400 bg-blue-400/5 border-blue-400/10',
  'Data / AI': 'text-rose-400 bg-rose-400/5 border-rose-400/10',
  'Game / Graphics': 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10',
  'Cyber / Network': 'text-yellow-400 bg-yellow-400/5 border-yellow-400/10',
};

export const FeedbackPage = ({
  requests,
  loading,
}: {
  requests: BadgeRequest[];
  loading: boolean;
}) => {
  // แสดงเฉพาะ approved ที่มี comment
  const withFeedback = requests.filter((r) => r.status === 'approved' && r.comment);
  // ถ้าไม่มี comment ก็แสดง approved ทั้งหมด
  const display = withFeedback.length > 0 ? withFeedback : requests.filter((r) => r.status === 'approved');

  return (
    <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col space-y-8 shadow-2xl shadow-rose-500/5">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-xl font-bold">Professor Feedback &amp; Activity</h3>
          <p className="text-xs text-slate-500 mt-1">Track your evaluation history and comments from faculty</p>
        </div>
        <button className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all">
          View All
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {loading ? (
        // Loading skeleton
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-white/5 rounded-full" />
                <div className="h-4 w-20 bg-white/5 rounded" />
              </div>
              <div className="h-6 w-64 bg-white/5 rounded" />
              <div className="bg-[#050505] rounded-[2rem] p-8 border border-white/5">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : display.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <MessageSquare size={28} className="text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium">No feedback yet.</p>
          <p className="text-slate-600 text-xs max-w-sm">
            Once a professor reviews and approves your badge request, their feedback will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {display.map((req) => {
            const catColor = categoryColor[req.category] || 'text-slate-400 bg-slate-400/5 border-slate-400/10';
            return (
              <div key={req.id} className="flex flex-col gap-4 items-start">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-extrabold bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                    <ShieldCheck size={14} /> Approved
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold tracking-widest">
                    {formatDate(req.verified_at || req.updated_at)}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border ${catColor}`}>
                    {req.category}
                  </span>
                </div>

                <div className="text-left">
                  <h4 className="text-xl font-bold">Credential Issued: {req.badge_name}</h4>
                  {req.comment ? (
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
                      Verified and issued to your wallet.
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
                      Your submission was verified and the credential has been issued to your wallet.
                    </p>
                  )}
                </div>

                {req.comment && (
                  <div className="bg-[#050505] rounded-[2rem] p-8 border border-white/5 relative group w-full text-left overflow-hidden">
                    <div className="absolute top-6 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Quote size={80} />
                    </div>
                    <div className="flex gap-6 items-start relative z-10">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl bg-slate-800 flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-400">P</span>
                      </div>
                      <p className="text-base text-slate-300 italic font-light leading-relaxed max-w-5xl">
                        &ldquo;{req.comment}&rdquo;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
