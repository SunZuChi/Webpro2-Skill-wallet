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
  Link as LinkIcon
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
const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

    
const filteredBadges = activeFilter === 'all' 
    ? INITIAL_BADGES 
    : INITIAL_BADGES.filter(b => b.type === activeFilter);
    return(
    <div>
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            
             {CATEGORIES.map((cat) => (
               <button 
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-6 py-2.5 rounded-xl font-extrabold text-[10px] whitespace-nowrap transition-all border ${activeFilter === cat.id ? cat.color : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'}`}
               >
                 {cat.label}
               </button>
             ))}
            <div className="ml-auto">
             <button 
                onClick={() => setShowRequestModal(true)}
                className="cursor-pointer bg-[#ff4f40] hover:bg-[#e53e30] text-white text-[10px] sm:text-[11px] font-bold px-5 sm:px-8 py-3 rounded-xl transition-all shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 transform active:scale-95 uppercase tracking-widest"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Request New Badge</span><span className="sm:hidden">Request</span>
              </button>
              </div> 
          </div>
           
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
              <div key={badge.id} className="bg-[#0f0f11] border border-white/5 rounded-[1.8rem] p-8 flex flex-col min-h-[340px] hover:border-[#ff4f40]/30 transition-all cursor-pointer group relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
                     <img src={badge.icon} className="w-10 h-10 object-contain" alt={badge.title} />
                  </div>
                  <MoreVertical size={16} className="text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-6 group-hover:text-[#ff4f40] transition-colors leading-tight">{badge.title}</h3>
                  <span className="inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400">{badge.category}</span>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={badge.profImage} className="w-8 h-8 rounded-full border border-white/10" alt="Prof" />
                    <div className="flex flex-col">
                       <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-extrabold uppercase tracking-tighter"><ShieldCheck size={10} /> Verified</div>
                       <p className="text-[11px] text-slate-400 font-medium">{badge.professor}</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}

            <div 
              onClick={() => setShowRequestModal(true)}
              className="bg-[#050505] border-2 border-dashed border-[#1a1a1a] rounded-[1.8rem] p-8 flex flex-col items-center justify-center text-center hover:border-[#ff4f40]/40 transition-all cursor-pointer group min-h-[340px] shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mb-6 group-hover:bg-[#ff4f40] group-hover:text-white group-hover:scale-110 transition-all shadow-lg"><Plus size={32} /></div>
              <h3 className="text-xl font-bold text-white mb-3">New Badge</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[180px] mb-8 uppercase font-bold tracking-tight">Ready To Earn A New Badge? Submit Your Project To Get Verified By Your Professor.</p>
              <button className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#ff4f40] transition-colors border-t border-white/5 pt-5 w-full">START REQUEST</button>
            </div>
          </div>
          <RequestModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} />
          </div>
          
    );
}