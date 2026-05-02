"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Medal, FolderOpen, FileUp, Settings, AlignLeft,
  Clock, RotateCcw, ShieldCheck, Quote, ChevronRight, ExternalLink,
  LogOut, X, Bell, Menu, User, Plus, Edit3, MapPin, Mail,
  Briefcase, GraduationCap, Share2, Pin, PinOff, MoreVertical,
  Check, Upload, Link as LinkIcon, Trash2, Calendar, BookOpen, Target, Image as ImageIcon,
  Globe, Cpu, Layers
} from 'lucide-react';

/** * [IP&S SYSTEM] - INTEGRATED SKILL HUB PRO (FIXED VERSION)
 * Features: 
 * - Fixed Github Import Error (Using Inline SVG)
 * - Max 4 Pins for Badges with Full Details
 * - Project Preview & Submission with Tech Stack
 * - Context-Aware Modals for Experience vs Education
 */

const CONTAINER_CLASS = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

// --- Custom Inline Icons to avoid Import Errors ---
const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// [QUERY]: ข้อมูลจำลองของ Badge
const MOCK_BADGES = [
  { id: 1, title: "React Architecture", category: "SOFTWARE / WEB", prof: "Prof. Wittawin", profImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { id: 2, title: "UI Design Patterns", category: "GAME / GRAPHICS", prof: "Prof. Wittawin", profImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { id: 3, title: "Node.js Backend", category: "SOFTWARE / WEB", prof: "Prof. Wittawin", profImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
  { id: 4, title: "Database Systems", category: "DATA / AI", prof: "Prof. Prapatsorn", profImg: "https://i.pravatar.cc/100?u=2", icon: "https://www.svgrepo.com/show/303251/mysql-logo.svg" },
  { id: 5, title: "Network Security", category: "CYBER / NETWORK", prof: "Prof. Somchai", profImg: "https://i.pravatar.cc/100?u=3", icon: "https://www.svgrepo.com/show/353622/cyber-security.svg" },
  { id: 6, title: "Immersive VR", category: "GAME / GRAPHICS", prof: "Prof. Wittawin", profImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", icon: "https://www.svgrepo.com/show/342337/unity.svg" },
];

// [QUERY]: ข้อมูลจำลองของ Projects
const MOCK_PROJECTS = [
  { id: 1, title: "Ip&s Portfolio v.2", desc: "A comprehensive skill tracking and digital wallet platform for IT students to showcase their verified credentials.", longDesc: "This project focuses on bridging the gap between academic theory and industry reality. Built with Next.js and Tailwind CSS, it features a real-time pinning system for digital badges and a modular portfolio layout.", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", tags: ["Next.js", "Tailwind", "Firebase"], github: "https://github.com", demo: "https://demo.com" },
  { id: 2, title: "E-Commerce Microservices", desc: "Scalable backend architecture using Node.js microservices and Docker containers.", longDesc: "Detailed backend implementation focusing on event-driven architecture. Each service communicates via RabbitMQ to ensure decoupling and horizontal scalability.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=800&q=80", tags: ["Node.js", "Docker", "Redis"], github: "https://github.com", demo: "" },
  { id: 3, title: "Financial Tracker Mobile", desc: "Cross-platform mobile application for personal expense tracking and financial planning.", longDesc: "Developed with React Native, this app provides detailed visual analytics of spending habits. It uses local encryption for data security.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", tags: ["React Native", "Charts", "Sqlite"], github: "https://github.com", demo: "https://appstore.com" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('skillhub');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Data States
  const [pinnedBadgeIds, setPinnedBadgeIds] = useState<number[]>([1, 2, 3]);
  const [editingData, setEditingData] = useState<any>(null);

  const togglePin = (id: number) => {
    setPinnedBadgeIds(prev => {
      const isAlreadyPinned = prev.includes(id);
      if (!isAlreadyPinned && prev.length >= 4) return prev;
      return isAlreadyPinned ? prev.filter(bid => bid !== id) : [...prev, id];
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'skillhub':
        return (
          <SkillHubView
            onOpenBadgeModal={() => setActiveModal('badge-select')}
            onAddProject={() => { setEditingData(null); setActiveModal('project-submit'); }}
            onPreviewProject={(p: any) => { setEditingData(p); setActiveModal('project-preview'); }}
            onEditProfile={() => setActiveModal('profile')}
            onAddExperience={() => { setEditingData(null); setActiveModal('experience'); }}
            onAddEducation={() => { setEditingData(null); setActiveModal('education'); }}
            pinnedBadgeIds={pinnedBadgeIds}
            togglePin={togglePin}
          />
        );
      default: return <div className={`${CONTAINER_CLASS} py-20 text-center opacity-20`}><h2 className="text-2xl font-bold uppercase tracking-widest text-white">Section Coming Soon</h2></div>;
    }
  };


  return (
    <>
      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto flex flex-col relative transition-all duration-300 w-full">
        <header className="h-[70px] md:h-[90px] border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center transition-all">
          <div className={CONTAINER_CLASS}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400 transition-colors"><Menu size={24} /></button>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Skill Hub</h1>
              </div>
              <button className="cursor-pointer bg-[#ff4f40] hover:bg-[#e53e30] text-white text-[10px] sm:text-[11px] font-bold px-5 sm:px-8 py-3 rounded-xl transition-all shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 transform active:scale-95 uppercase tracking-widest">
                <Share2 size={16} /> <span className="hidden sm:inline">Export Portfolio</span><span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </header>
        {renderContent()}
      </main>

      {/* ⚡️ MODALS SYSTEM */}
      <BadgeSelectModal isOpen={activeModal === 'badge-select'} onClose={() => setActiveModal(null)} pinnedBadgeIds={pinnedBadgeIds} togglePin={togglePin} />
      <SubmissionModal isOpen={activeModal === 'project-submit'} onClose={() => setActiveModal(null)} type="project" initialData={editingData} />
      <ProjectPreviewModal isOpen={activeModal === 'project-preview'} onClose={() => setActiveModal(null)} project={editingData} onEdit={() => setActiveModal('project-submit')} />
      <ProfileEditModal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} />
      <TimelineEditModal isOpen={activeModal === 'experience' || activeModal === 'education'} onClose={() => setActiveModal(null)} type={activeModal === 'experience' ? 'experience' : 'education'} initialData={editingData} />

    </>
  );
}

// ==========================================
// VIEW: SKILL HUB
// ==========================================
const SkillHubView = ({ onOpenBadgeModal, onAddProject, onPreviewProject, onEditProfile, onAddExperience, onAddEducation, pinnedBadgeIds, togglePin }: any) => {
  const displayBadges = MOCK_BADGES.filter(b => pinnedBadgeIds.includes(b.id));

  return (
    <div className={`${CONTAINER_CLASS} py-8 md:py-10 space-y-14 animate-in fade-in duration-700`}>

      {/* SECTION: Profile Banner */}
      <section>
        <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl group">
          <div className="h-32 md:h-48 bg-gradient-to-r from-[#1a1a1a] via-[#ff4f40]/10 to-[#1a1a1a]"></div>
          <div className="px-8 md:px-12 pb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 mb-8">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-3xl bg-[#0f0f11] border-4 border-[#050505] shadow-2xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2 md:pb-2 text-left">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Yosapart Raúl</h2>
                  <button onClick={onEditProfile} className="p-3 bg-white/5 hover:bg-[#ff4f40] hover:text-white rounded-2xl transition-all text-slate-400 group">
                    <Edit3 size={18} />
                  </button>
                </div>
                <p className="text-[#ff4f40] font-bold text-sm md:text-base uppercase tracking-wider">Aspiring Full-Stack Developer & UI/UX Enthusiast</p>
                <div className="flex flex-wrap gap-4 md:gap-6 pt-2 text-slate-500 text-xs sm:text-sm font-medium">
                  <span className="flex items-center gap-2"><MapPin size={14} /> Bangkok, Thailand</span>
                  <span className="flex items-center gap-2 underline decoration-white/10"><Mail size={14} /> yosapart.r@student.kmutt.ac.th</span>
                </div>
              </div>
            </div>
            <div className="h-px bg-white/5 w-full mb-8"></div>
            <div className="space-y-4 text-left">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">About Me</h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-5xl font-light">Senior Applied Computer Science student with a strong passion for building scalable web applications. Currently looking for a Software Engineering Internship.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Featured Projects */}
      <section className="space-y-8">
        <div className="flex items-center gap-3"><FolderOpen className="text-[#ff4f40]" size={24} /><h3 className="text-2xl font-bold tracking-tight text-white">Featured Projects</h3></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {MOCK_PROJECTS.map(project => (
            <div key={project.id} onClick={() => onPreviewProject(project)} className="bg-[#0f0f11] border border-white/5 rounded-[2.2rem] flex flex-col min-h-[360px] hover:border-[#ff4f40]/30 transition-all cursor-pointer group relative overflow-hidden shadow-xl">
              <div className="h-48 bg-black/40 relative overflow-hidden">
                <img src={project.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60" alt={project.title} />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">Project</div>
              </div>
              <div className="p-8 flex-1 flex flex-col text-left">
                <h4 className="font-bold text-xl leading-tight mb-3 group-hover:text-[#ff4f40] transition-colors text-white">{project.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-3 font-light leading-relaxed mb-6">{project.desc}</p>
                <div className="mt-auto flex justify-between items-center">
                  <div className="flex gap-2">
                    {project.tags.map(t => <span key={t} className="px-2 py-1 rounded-md bg-white/5 text-slate-400 text-[9px] font-bold uppercase">{t}</span>)}
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-[#ff4f40] transition-all transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}

          <div onClick={onAddProject} className="bg-[#050505] border-2 border-dashed border-white/5 rounded-[2.2rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#ff4f40]/40 transition-all min-h-[360px] shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-[#ff4f40] group-hover:text-white group-hover:scale-110 transition-all mb-6 shadow-inner"><Plus size={36} /></div>
            <h4 className="font-bold text-white text-xl mb-2 uppercase tracking-tight">Add New Project</h4>
            <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest max-w-[200px] leading-relaxed">Upload and showcase your latest achievements.</p>
          </div>
        </div>
      </section>

      {/* SECTION: My Badges */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><Medal className="text-[#ff4f40]" size={24} /><h3 className="text-2xl font-bold tracking-tight text-white">My Badges</h3></div>
          <button onClick={onOpenBadgeModal} className="text-xs font-black text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group transition-all">VIEW ALL <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {displayBadges.length > 0 ? displayBadges.map((badge) => (
            <div key={badge.id} className="bg-[#0f0f11] border border-white/5 shadow-2xl rounded-[2.2rem] p-8 flex flex-col min-h-[340px] group transition-all hover:border-[#ff4f40]/40 relative animate-in zoom-in-95 duration-500">
              <button onClick={(e) => { e.stopPropagation(); togglePin(badge.id); }} className="absolute top-6 right-6 p-2 rounded-xl bg-[#ff4f40] text-white hover:bg-rose-600 transition-all z-10 shadow-lg"><PinOff size={16} /></button>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                <img src={badge.icon} className="w-10 h-10 object-contain" alt="badge icon" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xl font-bold text-white mb-6 group-hover:text-[#ff4f40] transition-colors leading-tight">{badge.title}</h4>
                <span className="inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400">{badge.category}</span>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={badge.profImg} className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="Prof" />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-extrabold uppercase tracking-tighter leading-none"><ShieldCheck size={10} /> Verified</div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{badge.prof}</p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          )) : (
            <div onClick={onOpenBadgeModal} className="col-span-full bg-[#050505] border-2 border-dashed border-white/5 rounded-[2.2rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/20 transition-all shadow-inner">
              <PinOff size={32} className="text-slate-600 mb-4" /><h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">No Badges Pinned (Max 4)</h4><p className="text-[10px] text-slate-600 mt-2">Select badges to showcase on your profile</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION: Experience & Education */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Briefcase className="text-[#ff4f40]" size={24} /><h3 className="text-2xl font-bold tracking-tight text-white">Experience</h3></div>
            <button onClick={onAddExperience} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#ff4f40] transition-all flex items-center justify-center text-white shadow-lg transform active:scale-90"><Plus size={20} /></button>
          </div>
          <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-8 min-h-[280px] flex items-center justify-center group cursor-pointer hover:border-white/10 transition-all shadow-xl">
            <p className="text-slate-600 uppercase font-black text-[10px] tracking-[0.2em] opacity-50">No Experience Added Yet</p>
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><GraduationCap className="text-[#ff4f40]" size={24} /><h3 className="text-2xl font-bold tracking-tight text-white">Education</h3></div>
            <button onClick={onAddEducation} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#ff4f40] transition-all flex items-center justify-center text-white shadow-lg transform active:scale-90"><Plus size={20} /></button>
          </div>
          <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-8 min-h-[280px] flex flex-col justify-between hover:border-[#ff4f40]/20 transition-all group shadow-xl relative overflow-hidden">
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xl text-white">KMUTT</h4>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2021 - Present</span>
              </div>
              <p className="text-[#ff4f40] font-bold text-sm">B.Sc. Applied Computer Science</p>
              <p className="text-slate-500 text-sm font-light leading-relaxed">Specializing in Full-stack Software Architecture and UI/UX Research.</p>
            </div>
            <div className="pt-6 border-t border-white/5 text-right">
              <button onClick={onAddEducation} className="text-[10px] font-black text-slate-500 hover:text-[#ff4f40] uppercase tracking-widest flex items-center gap-1 transition-all ml-auto font-bold">EDIT <ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-auto py-12 border-t border-white/5 opacity-30 text-center uppercase font-bold tracking-[0.5em] text-[10px]">Ip&s IT Portfolio & Skill © 2026</footer>
    </div>
  );
};

// ==========================================
// MODALS
// ==========================================

const ProjectPreviewModal = ({ isOpen, onClose, project, onEdit }: any) => {
  if (!isOpen || !project) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">
        <div className="h-64 sm:h-96 w-full relative">
          <img src={project.image} className="w-full h-full object-cover" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#ff4f40] transition-all group z-50 shadow-xl"><X size={24} className="group-hover:rotate-90 transition-transform duration-300" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 sm:p-14 custom-scrollbar -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">{project.tags.map((t: string) => <span key={t} className="px-3 py-1 rounded-lg bg-[#ff4f40]/10 text-[#ff4f40] text-[10px] font-black uppercase tracking-widest border border-[#ff4f40]/20">{t}</span>)}</div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">{project.title}</h2>
            </div>
            <div className="flex gap-4">
              <a href="#" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-white"><GithubIcon size={20} /></a>
              <a href="#" className="p-4 bg-[#ff4f40] hover:bg-[#e53e30] rounded-2xl transition-all text-white shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 font-bold text-sm">Live Demo <Globe size={18} /></a>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4"><h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">Project Description <div className="h-px flex-1 bg-white/5"></div></h3><p className="text-lg text-slate-300 leading-relaxed font-light">{project.longDesc}</p></div>
            </div>
            <div className="space-y-8"><div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6"><h4 className="text-xs font-black text-slate-500 uppercase tracking-widest text-white">Metadata</h4><div className="space-y-4"><div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Status</span><span className="text-emerald-500 font-bold text-sm">Completed</span></div><div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Year</span><span className="text-white font-bold text-sm">2026</span></div></div><button onClick={onEdit} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-sm font-bold flex items-center justify-center gap-2 text-white"><Edit3 size={16} /> Edit Details</button></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionModal = ({ isOpen, onClose, type, initialData }: any) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [techStack, setTechStack] = useState<string[]>(initialData?.tags || []);
  const [techInput, setTechInput] = useState('');

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()]);
      }
      setTechInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">
        <div className="p-8 sm:p-10 border-b border-white/5 bg-[#0f0f11] flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">{initialData ? 'Edit Project' : 'New Project Submission'}</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Showcase your technical legacy.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors"><X size={28} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300"><ImageIcon size={20} className="text-[#ff4f40]" /> Project Cover Image</h3>
            <div className="aspect-video bg-black/50 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center relative group overflow-hidden hover:border-[#ff4f40]/30 transition-all cursor-pointer">
              {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-3 text-slate-600"><Upload size={40} /><p className="text-xs font-bold uppercase tracking-widest">Click to upload cover</p></div>}
            </div>
          </section>
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300"><Cpu size={20} className="text-[#ff4f40]" /> Tech Stack</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input type="text" placeholder="Add tech (Enter to add)..." className="flex-1 bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech} />
                <button onClick={() => { if (techInput.trim()) setTechStack([...techStack, techInput.trim()]); setTechInput(''); }} className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold transition-all text-white">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map(t => <span key={t} className="px-4 py-2 rounded-xl bg-[#ff4f40]/10 text-[#ff4f40] text-[10px] font-black uppercase tracking-widest border border-[#ff4f40]/20 flex items-center gap-2 animate-in zoom-in">{t} <X size={12} className="cursor-pointer" onClick={() => setTechStack(techStack.filter(item => item !== t))} /></span>)}
              </div>
            </div>
          </section>
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300"><Edit3 size={20} className="text-[#ff4f40]" /> Project Details</h3>
            <div className="space-y-6">
              <input type="text" placeholder="Project Title..." defaultValue={initialData?.title} className="w-full bg-black/50 border border-white/5 rounded-2xl px-8 py-5 text-xl font-bold focus:border-[#ff4f40]/50 outline-none text-white shadow-inner" />
              <textarea placeholder="Description..." defaultValue={initialData?.longDesc} className="w-full bg-black/50 border border-white/5 rounded-3xl p-8 text-sm min-h-[180px] outline-none focus:border-[#ff4f40]/50 transition-all italic font-light leading-relaxed placeholder:text-slate-800 text-white shadow-inner" />
            </div>
          </section>
        </div>
        <div className="p-8 border-t border-white/5 bg-[#0f0f11] flex justify-end gap-6">
          <button onClick={onClose} className="px-8 py-3 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Discard</button>
          <button className="bg-[#ff4f40] text-white font-extrabold px-12 py-4 rounded-[1.5rem] shadow-xl uppercase tracking-widest text-[10px] transform active:scale-95">Confirm Submission</button>
        </div>
      </div>
    </div>
  );
};

const BadgeSelectModal = ({ isOpen, onClose, pinnedBadgeIds, togglePin }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0f0f11]"><div><h2 className="text-2xl font-bold text-white">Select Featured Badges</h2><p className="text-sm text-slate-500 mt-1">Pin up to <span className="text-white font-bold">4 badges</span></p></div><button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-slate-400"><X size={28} /></button></div>
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BADGES.map(badge => {
            const isPinned = pinnedBadgeIds.includes(badge.id);
            const isFull = pinnedBadgeIds.length >= 4 && !isPinned;
            return (
              <div key={badge.id} onClick={() => !isFull && togglePin(badge.id)} className={`p-8 rounded-[2.5rem] border transition-all relative group cursor-pointer ${isPinned ? 'bg-[#ff4f40]/5 border-[#ff4f40]/40 shadow-2xl' : isFull ? 'opacity-30 grayscale cursor-not-allowed border-white/5' : 'bg-[#121214] border-white/5 hover:border-white/10'}`}>
                <div className="flex justify-between items-start mb-8"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden ${isPinned ? 'bg-[#ff4f40]/20' : 'bg-white/5'}`}><img src={badge.icon} className="w-10 h-10 object-contain" /></div><div className={`p-2 rounded-xl transition-all ${isPinned ? 'bg-[#ff4f40] text-white scale-110 shadow-lg' : 'bg-white/5 text-slate-600'}`}>{isPinned ? <Pin size={16} fill="currentColor" /> : <Plus size={16} />}</div></div>
                <h4 className="font-bold text-xl mb-2 text-white">{badge.title}</h4><p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${isPinned ? 'text-[#ff4f40]' : 'text-slate-500'}`}>{badge.category}</p>
                <div className="pt-5 border-t border-white/5 flex items-center gap-3"><img src={badge.profImg} className="w-7 h-7 rounded-full object-cover" /><span className="text-[10px] text-slate-500 font-medium">{badge.prof}</span></div>
                {isPinned && <div className="absolute -bottom-1 -right-1 p-4 bg-[#ff4f40] rounded-tl-3xl shadow-xl"><Check size={14} strokeWidth={4} /></div>}
              </div>
            );
          })}
        </div>
        <div className="p-8 border-t border-white/5 bg-[#0f0f11] flex justify-between items-center"><span className="text-sm font-medium text-slate-500"><span className="text-white font-bold">{pinnedBadgeIds.length}/4</span> Selected</span><button onClick={onClose} className="bg-white text-black font-extrabold px-12 py-4 rounded-[1.5rem] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs shadow-xl transform active:scale-95">Save Selection</button></div>
      </div>
    </div>
  );
};

const TimelineEditModal = ({ isOpen, onClose, type }: any) => {
  if (!isOpen) return null;
  const isEdu = type === 'education';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 text-left">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold flex items-center gap-3 capitalize text-white">{isEdu ? <GraduationCap className="text-[#ff4f40]" /> : <Briefcase className="text-[#ff4f40]" />} Edit {type}</h2><button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X size={20} /></button></div>
        <div className="space-y-4"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isEdu ? "University / School" : "Company / Organization"}</label><input type="text" placeholder={isEdu ? "e.g. KMUTT" : "e.g. Google Thailand"} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner" /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isEdu ? "Degree / Major" : "Job Title / Position"}</label><input type="text" placeholder={isEdu ? "e.g. B.Sc. Applied Computer Science" : "e.g. Software Engineer Intern"} className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner" /></div><div className="grid grid-cols-2 gap-4 pt-2"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Start Year</label><div className="relative"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} /><input type="text" placeholder="2021" className="w-full bg-black border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-center text-white" /></div></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">End Year</label><div className="relative"><Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} /><input type="text" placeholder="Present" className="w-full bg-black border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-center text-white" /></div></div></div></div>
        <div className="flex justify-end gap-6 pt-6 border-t border-white/5"><button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Cancel</button><button className="bg-white text-black font-extrabold px-10 py-4 rounded-[1.5rem] shadow-xl uppercase tracking-widest text-[10px]">Save Changes</button></div>
      </div>
    </div>
  );
};

const ProfileEditModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 text-left">
        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
        <div className="space-y-5"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label><input type="text" defaultValue="Yosapart Raúl" className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner" /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Headline</label><input type="text" defaultValue="Aspiring Full-Stack Developer" className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner" /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bio</label><textarea defaultValue="Senior Applied Computer Science student..." className="w-full bg-black border border-white/5 rounded-2xl p-6 text-sm min-h-[120px] focus:border-[#ff4f40]/50 outline-none text-white shadow-inner" /></div></div>
        <div className="flex justify-end gap-6 pt-6 border-t border-white/5"><button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Cancel</button><button className="bg-white text-black font-extrabold px-10 py-4 rounded-[1.5rem] shadow-xl uppercase tracking-widest text-[10px]">Update Profile</button></div>
      </div>
    </div>
  );
};

