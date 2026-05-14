"use client";

import React, { useState } from 'react';
import {
  Settings, AlignLeft, Download, X, Layout, FolderOpen,
  ShieldCheck, Quote, ChevronRight, CheckCircle2,
  MapPin, Mail, Phone, User, GraduationCap, Briefcase,
  Code, Medal, FileUp
} from 'lucide-react';
import { Sidebar4 } from './sidebar4';

const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

const GithubIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const USER_REAL_PROFILE = {
  name: "THANAKORN KARNDEE",
  title: "Senior Applied Computer Science Student",
  address: "647/29, Moo 1, Pracha Uthit 49 Alley, Bangkok",
  phone: "+66 97 939 6470",
  email: "thanakornkarndee@gmail.com",
  summary: "Senior Applied Computer Science student with a strong passion for building scalable web applications and intuitive user interfaces. Experienced in React, Node.js, and modern cloud infrastructures.",
  education: {
    uni: "King Mongkut's University of Technology Thonburi",
    degree: "Bachelor of Science in Applied Computer Science",
    gpax: "3.37",
    year: "2021 - Present"
  },
  projects: [
    { title: "Jak-Jai Mobile App", tech: "React Native, Node.js", desc: "Designed prototype cross-generational communication app to connect elderly and youth through voice and text sharing." },
    { title: "Hatyai Condo System", tech: "Next.js, SQL, REST API", desc: "Centralized property management dashboard with real-time tracking of occupancy, leases, and utility billing." },
    { title: "EcoStay Connect", tech: "React, Tailwind, UI/UX", desc: "Sustainable tourism platform connecting eco-conscious travelers with accommodations to reduce carbon footprints." }
  ],
  skills: ["React", "Next.js", "Tailwind CSS", "Node.js", "Python", "SQL", "C++", "Figma"],
  verifiedBadges: ["Software Architecture", "UI Design Patterns", "Advanced React"]
};

export default function Preview() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  // Mobile: show config panel as bottom sheet / drawer
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState({
    profilePhoto: true,
    descriptionProfile: true,
    verifiedBadges: true,
    professorFeedback: true,
    personalProjects: true,
    technicalSkills: true
  });

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">

      <Sidebar4 isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative transition-all duration-300 pt-14 md:pt-0">

        {/* HEADER */}
        <header className="h-14 md:h-17.5 lg:h-22.5 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center shrink-0">
          <div className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Export Verified Resume</h1>
            <div className="flex items-center gap-2 shrink-0">
              {/* Config toggle button — mobile only */}
              <button
                onClick={() => setConfigOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <Settings size={18} />
              </button>
              <button className="cursor-pointer bg-[#ff4f40] hover:bg-[#e53e30] text-white text-[10px] sm:text-[11px] font-bold px-4 sm:px-8 py-2.5 md:py-3 rounded-xl transition-all shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 active:scale-95 uppercase tracking-widest">
                <Download size={16} /> <span className="hidden sm:inline">Export PDF</span><span className="sm:hidden">Export</span>
              </button>
            </div>
            <button className="bg-[#ff4f40] hover:bg-[#e53e30] text-white text-[11px] font-black px-8 py-3 rounded-2xl transition-all shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 transform active:scale-95 uppercase tracking-widest">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </header>

        {/* WORKSPACE */}
        <div className="flex flex-1 overflow-hidden">

          {/* CONFIG PANEL — desktop: always visible left column */}
          <div className="hidden lg:flex w-100 bg-[#0a0a0a] border-r border-white/5 overflow-y-auto custom-scrollbar pl-10 pr-8 py-8 flex-col space-y-10 text-left shrink-0">
            <ConfigPanelContent
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              config={config}
              toggleConfig={toggleConfig}
            />
          </div>

          {/* CONFIG PANEL — mobile/tablet: bottom sheet drawer */}
          {configOpen && (
            <>
              <div
                className="lg:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                onClick={() => setConfigOpen(false)}
              />
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-70 bg-[#0a0a0a] border-t border-white/5 rounded-t-3xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                {/* Handle */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5 sticky top-0 bg-[#0a0a0a] z-10">
                  <p className="text-sm font-bold text-white">Resume Settings</p>
                  <button onClick={() => setConfigOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 space-y-10">
                  <ConfigPanelContent
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    config={config}
                    toggleConfig={toggleConfig}
                  />
                </div>
              </div>
            </>
          )}

          {/* LIVE PREVIEW AREA */}
          <div className="flex-1 bg-[#050505] overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8 lg:py-12 flex justify-center items-start custom-scrollbar">
            <div className="w-full max-w-210 shadow-2xl animate-in fade-in zoom-in duration-700 origin-top">
              <ResumePaper template={selectedTemplate} config={config} />
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}} />
    </div>
  );
}

// ── CONFIG PANEL CONTENT (shared between desktop + mobile sheet) ──
const ConfigPanelContent = ({ selectedTemplate, setSelectedTemplate, config, toggleConfig }: any) => (
  <>
    {/* Template Selection */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Layout className="text-[#ff4f40]" size={18} />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Template Style</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setSelectedTemplate(i)}
            className={`cursor-pointer aspect-3/4 bg-[#121214] rounded-2xl border-2 transition-all p-3 relative ${selectedTemplate === i ? 'border-[#ff4f40]' : 'border-white/5 hover:border-white/10'}`}
          >
            <div className="w-full h-1 bg-white/10 rounded mb-1" />
            <div className="w-2/3 h-3 bg-white/5 rounded mb-4" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-white/3 rounded" />
              <div className="w-full h-1 bg-white/3 rounded" />
            </div>
            {selectedTemplate === i && (
              <div className="absolute top-2 right-2"><CheckCircle2 size={12} className="text-[#ff4f40]" /></div>
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Config Toggles */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderOpen className="text-[#ff4f40]" size={18} />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Content Included</h3>
      </div>
      <div className="space-y-3">
        <ConfigToggle label="Profile Photo" sub="Include your avatar image" active={config.profilePhoto} onClick={() => toggleConfig('profilePhoto')} />
        <ConfigToggle label="About Me Section" sub="Shows career objective" active={config.descriptionProfile} onClick={() => toggleConfig('descriptionProfile')} />
        <ConfigToggle label="Verified Badges" sub="Shows university credentials" active={config.verifiedBadges} onClick={() => toggleConfig('verifiedBadges')} />
        <ConfigToggle label="Professor Feedback" sub="Quotes from faculty reviews" active={config.professorFeedback} onClick={() => toggleConfig('professorFeedback')} />
        <ConfigToggle label="Featured Projects" sub="Shows personal & class work" active={config.personalProjects} onClick={() => toggleConfig('personalProjects')} />
        <ConfigToggle label="Technical Skills" sub="Verified skills overview" active={config.technicalSkills} onClick={() => toggleConfig('technicalSkills')} />
      </div>
    </div>

    <div className="p-6 rounded-4xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
      <div className="flex items-center gap-3 text-emerald-500">
        <ShieldCheck size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Security Verified</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
        Every badge and project in this document has been cryptographically signed by authorized faculty.
      </p>
    </div>
  </>
);

// ── RESUME PAPER ──
const ResumePaper = ({ template, config }: { template: number; config: any }) => {
  const data = USER_REAL_PROFILE;
  return (
    <div className="w-full bg-white text-slate-900 p-6 sm:p-10 lg:p-14 flex flex-col font-sans text-left relative">
      <div className="absolute top-6 right-6 opacity-[0.03] rotate-12 pointer-events-none select-none">
        <ShieldCheck size={120} className="sm:w-50 sm:h-50" />
      </div>

      {/* ── RESUME HEADER ── */}
      <header className={`flex items-start justify-between border-b-2 border-slate-900 pb-5 sm:pb-8 mb-6 sm:mb-10 gap-4 ${template === 2 ? 'flex-col sm:flex-row' : ''}`}>
        <div className="space-y-2 sm:space-y-4 min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-slate-950 uppercase leading-tight">{data.name}</h1>
          <div className="space-y-1 text-slate-500 text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-widest">
            <p className="flex items-center gap-1.5 sm:gap-2"><MapPin size={10} className="shrink-0" /><span className="truncate">{data.address}</span></p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <p className="flex items-center gap-1.5"><Phone size={10} className="shrink-0" /> {data.phone}</p>
              <p className="flex items-center gap-1.5 min-w-0"><Mail size={10} className="shrink-0" /><span className="truncate">{data.email}</span></p>
            </div>
          </div>
        </div>
        {config.profilePhoto && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 shadow-lg">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Profile" />
          </div>
        )}
      </header>
      {/* ── RESUME BODY ── */}
      <div className={`flex-1 flex ${template === 2 ? 'flex-col sm:flex-row gap-6 sm:gap-12' : 'flex-col gap-6 sm:gap-10'}`}>
        <div className={`${template === 2 ? 'sm:w-2/3' : 'w-full'} space-y-6 sm:space-y-10`}>
          {config.descriptionProfile && (
            <section className="space-y-2 sm:space-y-3">
              <h3 className="text-[9px] sm:text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2">
                <User size={11} /> Profile Summary
              </h3>
              <p className="text-[10px] sm:text-[11px] lg:text-[12px] text-slate-600 leading-relaxed font-light">{data.summary}</p>
            </section>
          )}
          <section className="space-y-2 sm:space-y-4">
            <h3 className="text-[9px] sm:text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2">
              <GraduationCap size={11} /> Education
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-[11px] sm:text-[12px] lg:text-[13px] text-slate-900 leading-snug">{data.education.uni}</h4>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 shrink-0">{data.education.year}</span>
              </div>
              <p className="text-[10px] sm:text-[12px] text-slate-600">{data.education.degree}</p>
              <p className="text-[10px] sm:text-[12px] font-bold text-slate-900 mt-0.5">GPAX: {data.education.gpax}</p>
            </div>
          </section>
          {config.personalProjects && (
            <section className="space-y-3 sm:space-y-6">
              <h3 className="text-[9px] sm:text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2">
                <Briefcase size={11} /> Featured Projects
              </h3>
              <div className="space-y-3 sm:space-y-6">
                {data.projects.map((proj, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-[11px] sm:text-[13px] text-slate-900 underline decoration-slate-200 underline-offset-4 leading-snug">{proj.title}</h4>
                      <span className="text-[8px] sm:text-[9px] font-black text-blue-500 uppercase tracking-widest shrink-0 text-right">{proj.tech}</span>
                    </div>
                    <p className="text-[9px] sm:text-[11px] text-slate-500 leading-relaxed font-light">{proj.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {config.professorFeedback && (
            <section className="space-y-2 sm:space-y-4">
              <h3 className="text-[9px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2">
                <Quote size={11} /> Professor Feedback
              </h3>
              <div className="bg-emerald-50/40 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-100">
                <p className="text-[9px] sm:text-[11px] text-emerald-900 leading-relaxed">
                  "Thanakorn exhibits superior architectural knowledge in Software track. His Hatyai Condo project shows a deep understanding of REST API scalability and responsive design principles."
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                  <CheckCircle2 size={9} className="text-emerald-500 shrink-0" />
                  <p className="text-[8px] sm:text-[9px] font-black text-emerald-700 uppercase">— Verified by Prof. Wittawin Susutti</p>
                </div>
              </div>
            </section>
          )}
        </div>
        <div className={`${template === 2 ? 'sm:w-1/3' : 'w-full'} space-y-6 sm:space-y-10`}>
          {config.verifiedBadges && (
            <section className="space-y-2 sm:space-y-4">
              <h3 className="text-[9px] sm:text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2">
                <Medal size={11} /> Verified Badges
              </h3>
              <div className={`grid gap-1.5 sm:gap-2 ${template === 2 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {data.verifiedBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2 p-2 sm:p-2.5 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#ff4f40] flex items-center justify-center text-white shrink-0"><ShieldCheck size={10} /></div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase text-slate-700 leading-tight">{badge}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {config.technicalSkills && (
            <section className="space-y-3 sm:space-y-6">
              <h3 className="text-[9px] sm:text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2">
                <Code size={11} /> Technical Stack
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                {data.skills.map(s => (
                  <span key={s} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900 text-white text-[7px] sm:text-[9px] font-black uppercase tracking-widest">{s}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      {/* ── RESUME FOOTER ── */}
      <footer className="mt-8 sm:mt-auto pt-6 sm:pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 opacity-50">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Ip&s IT Portfolio & Skill Wallet</span>
          <div className="hidden sm:block h-4 w-px bg-slate-300" />
          <span className="text-[8px] sm:text-[10px] font-medium text-slate-500 italic">This document is digitally verified.</span>
        </div>
        <div className="text-[7px] sm:text-[9px] font-black uppercase text-blue-600">
          KMUTT Applied Computer Science
        </div>
      </footer>
    </div>
  );
};

const ConfigToggle = ({ label, sub, active, onClick }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all group">
    <div className="text-left space-y-0.5">
      <p className="text-sm font-bold text-white group-hover:text-[#ff4f40] transition-colors leading-none">{label}</p>
      <p className="text-[10px] text-slate-500 font-medium mt-1.5 leading-none">{sub}</p>
    </div>
    <button
      onClick={onClick}
      className={`w-11 h-6 rounded-full relative transition-all duration-300 shrink-0 ml-3 ${active ? 'bg-[#ff4f40]' : 'bg-[#1a1a1a]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${active ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);