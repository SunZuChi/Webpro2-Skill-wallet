"use client";

import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  ExternalLink,
  MoreVertical,
} from 'lucide-react';

import { RequestModal } from './request';

const INITIAL_BADGES = [
  { id: 1, title: "Basic App Wireframe (Figma)", category: "GAME / GRAPHICS", professor: "Prof. Wittawin", profImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", type: 'game', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
  { id: 2, title: "Basic Backend (Node.js)", category: "SOFTWARE / WEB", professor: "Prof. Wittawin", profImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", type: 'software', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' },
  { id: 3, title: "Neural Network Basics", category: "DATA / AI", professor: "Prof. Prapatsorn", profImage: "https://i.pravatar.cc/100?u=2", type: 'data', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg' },
  { id: 4, title: "Network Security v1", category: "CYBER / NETWORK", professor: "Prof. Somchai", profImage: "https://i.pravatar.cc/100?u=3", type: 'cyber', icon: 'https://www.svgrepo.com/show/303251/mysql-logo.svg' },
];

const CATEGORIES = [
  { id: 'all', label: 'All', color: 'bg-white text-black' },
  { id: 'software', label: 'SOFTWARE / WEB', color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
  { id: 'data', label: 'DATA / AI', color: 'bg-rose-500/10 border-rose-500/20 text-rose-500' },
  { id: 'cyber', label: 'CYBER / NETWORK', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
  { id: 'game', label: 'GAME / GRAPHICS', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
];

export const BadgePage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const filteredBadges = activeFilter === 'all'
    ? INITIAL_BADGES
    : INITIAL_BADGES.filter(b => b.type === activeFilter);

  return (
    <div className="space-y-6">

      {/* ── Filter bar + Request button ── */}
      <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
        {/* Categories — wraps on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1 min-w-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`cursor-pointer shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-extrabold text-[9px] sm:text-[10px] whitespace-nowrap transition-all border ${activeFilter === cat.id
                  ? cat.color + ' border'
                  : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                }`}
            >
              {/* Short label on mobile */}
              <span className="sm:hidden">
                {cat.id === 'all' ? 'All' :
                  cat.id === 'software' ? 'WEB' :
                    cat.id === 'data' ? 'AI' :
                      cat.id === 'cyber' ? 'CYBER' : 'GAME'}
              </span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Request button — always visible */}
        <button
          onClick={() => setShowRequestModal(true)}
          className="shrink-0 cursor-pointer bg-[#ff4f40] hover:bg-[#e53e30] text-white text-[9px] sm:text-[11px] font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 active:scale-95 uppercase tracking-widest"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Request New Badge</span>
          <span className="sm:hidden">Request</span>
        </button>
      </div>

      {/* ── Badge grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className="bg-[#0f0f11] border border-white/5 rounded-[1.8rem] p-6 sm:p-8 flex flex-col min-h-70 sm:min-h-85 hover:border-[#ff4f40]/30 transition-all cursor-pointer group relative overflow-hidden animate-in fade-in zoom-in-95 duration-500"
          >
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center p-2 sm:p-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <img src={badge.icon} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" alt={badge.title} />
              </div>
              <MoreVertical size={16} className="text-slate-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6 group-hover:text-[#ff4f40] transition-colors leading-tight">{badge.title}</h3>
              <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400">{badge.category}</span>
            </div>
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={badge.profImage} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10" alt="Prof" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-emerald-500 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-tighter">
                    <ShieldCheck size={9} /> Verified
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{badge.professor}</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}

        {/* Add new badge card */}
        <div
          onClick={() => setShowRequestModal(true)}
          className="bg-[#050505] border-2 border-dashed border-[#1a1a1a] rounded-[1.8rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:border-[#ff4f40]/40 transition-all cursor-pointer group min-h-70 sm:min-h-85 shadow-2xl"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mb-4 sm:mb-6 group-hover:bg-[#ff4f40] group-hover:text-white group-hover:scale-110 transition-all shadow-lg">
            <Plus size={28} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">New Badge</h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed max-w-40 mb-6 sm:mb-8 uppercase font-bold tracking-tight">
            Ready To Earn A New Badge? Submit Your Project To Get Verified.
          </p>
          <button className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#ff4f40] transition-colors border-t border-white/5 pt-4 sm:pt-5 w-full">
            START REQUEST
          </button>
        </div>
      </div>

      <RequestModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} />
    </div>
  );
};