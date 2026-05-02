"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Quote, Menu, User, Download,
  FileText, Layout, CheckCircle2, MapPin, Mail, Phone,
  FolderOpen, Briefcase, GraduationCap, Code, Medal
} from 'lucide-react';

/** * [IP&S SYSTEM] - EXPORT VERIFIED RESUME WITH REAL USER PREVIEW
 * ข้อมูลถูกดึงมาจาก Profile, Badges และ Projects ของผู้ใช้จริง
 */
const CONTAINER_CLASS = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-10";

// --- Custom Inline Icon for Github ---
const GithubIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// [DATA]: ข้อมูลจริงของผู้ใช้ (จำลองว่าดึงมาจาก Database ของเว็บ)
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
  const [selectedTemplate, setSelectedTemplate] = useState(1);
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
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-[#050505] text-white">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff4f40]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* HEADER */}
      <header className="h-[70px] md:h-[90px] border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center shrink-0">
        <div className={CONTAINER_CLASS}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">Export Verified Resume</h1>
            </div>
            <button className="bg-[#ff4f40] hover:bg-[#e53e30] text-white text-[11px] font-black px-8 py-3 rounded-2xl transition-all shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 transform active:scale-95 uppercase tracking-widest">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#050505]">

        {/* CONFIG PANEL */}
        <div className="w-full lg:w-[420px] bg-[#0a0a0a] border-r border-white/5 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10">

          {/* Template Selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Layout className="text-[#ff4f40]" size={18} />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Template Style</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <button key={i} onClick={() => setSelectedTemplate(i)} className={`aspect-[3/4] bg-[#121214] rounded-2xl border-2 transition-all p-3 relative ${selectedTemplate === i ? 'border-[#ff4f40]' : 'border-white/5 hover:border-white/10'}`}>
                  <div className="w-full h-1 bg-white/10 rounded mb-1"></div>
                  <div className="w-2/3 h-3 bg-white/5 rounded mb-4"></div>
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-white/[0.03] rounded"></div>
                    <div className="w-full h-1 bg-white/[0.03] rounded"></div>
                  </div>
                  {selectedTemplate === i && <div className="absolute top-2 right-2"><CheckCircle2 size={12} className="text-[#ff4f40]" /></div>}
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

          <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Security Verified</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight">Every badge and project in this document has been cryptographically signed by authorized faculty.</p>
          </div>
        </div>

        {/* LIVE PREVIEW AREA (The Paper) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 flex justify-center items-start custom-scrollbar">
          <div className="w-full max-w-[840px] shadow-2xl animate-in fade-in zoom-in duration-700 origin-top">
            <ResumePaper template={selectedTemplate} config={config} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: REAL RESUME PAPER
// ==========================================
const ResumePaper = ({ template, config }: { template: number, config: any }) => {
  const data = USER_REAL_PROFILE;

  return (
    <div className="w-full aspect-[1/1.4142] bg-white text-slate-900 p-12 sm:p-16 flex flex-col font-sans overflow-hidden text-left relative">

      {/* Verification Stamp (Watermark) */}
      <div className="absolute top-10 right-10 opacity-[0.03] rotate-12 pointer-events-none select-none">
        <ShieldCheck size={200} />
      </div>

      {/* 1. Header Section */}
      <header className={`flex items-start justify-between border-b-2 border-slate-900 pb-8 mb-10 ${template === 2 ? 'flex-col sm:flex-row gap-6' : ''}`}>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase">{data.name}</h1>
          <div className="space-y-1 text-slate-500 text-[11px] font-bold uppercase tracking-[0.1em]">
            <p className="flex items-center gap-2"><MapPin size={12} /> {data.address}</p>
            <div className="flex flex-wrap gap-4">
              <p className="flex items-center gap-2"><Phone size={12} /> {data.phone}</p>
              <p className="flex items-center gap-2"><Mail size={12} /> {data.email}</p>
            </div>
          </div>
        </div>
        {config.profilePhoto && (
          <div className="w-24 h-24 bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-900 shrink-0 shadow-lg">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Profile" />
          </div>
        )}
      </header>

      {/* 2. Main Content Grid */}
      <div className={`flex-1 flex ${template === 2 ? 'gap-12' : 'flex-col gap-10'}`}>

        {/* Left/Main Column */}
        <div className={`${template === 2 ? 'w-2/3' : 'w-full'} space-y-10`}>

          {/* About Me */}
          {config.descriptionProfile && (
            <section className="space-y-3">
              <h3 className="text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <User size={14} /> Profile Summary
              </h3>
              <p className="text-[12px] text-slate-600 leading-relaxed font-light">{data.summary}</p>
            </section>
          )}

          {/* Education */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
              <GraduationCap size={14} /> Education
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-[13px] text-slate-900">{data.education.uni}</h4>
                <span className="text-[10px] font-bold text-slate-400">{data.education.year}</span>
              </div>
              <p className="text-[12px] text-slate-600">{data.education.degree}</p>
              <p className="text-[12px] font-bold text-slate-900 mt-1">GPAX: {data.education.gpax}</p>
            </div>
          </section>

          {/* Featured Projects */}
          {config.personalProjects && (
            <section className="space-y-6">
              <h3 className="text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Briefcase size={14} /> Featured Projects
              </h3>
              <div className="space-y-6">
                {data.projects.map((proj, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[13px] text-slate-900 underline decoration-slate-200 underline-offset-4">{proj.title}</h4>
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{proj.tech}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">{proj.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Professor Feedback */}
          {config.professorFeedback && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Quote size={14} /> Professor Feedback
              </h3>
              <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 relative">
                <p className="text-[11px] text-emerald-900 italic leading-relaxed pr-6">
                  "Thanakorn exhibits superior architectural knowledge in Software track. His Hatyai Condo project shows a deep understanding of REST API scalability and responsive design principles."
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  <p className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">— Verified by Prof. Wittawin Susutti</p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column (for Template 2) / Bottom for others */}
        <div className={`${template === 2 ? 'w-1/3' : 'w-full'} space-y-10`}>

          {/* Verified Badges */}
          {config.verifiedBadges && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Medal size={14} /> Verified Badges
              </h3>
              <div className={`grid gap-2 ${template === 2 ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {data.verifiedBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-md bg-[#ff4f40] flex items-center justify-center text-white"><ShieldCheck size={12} /></div>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{badge}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Technical Skills */}
          {config.technicalSkills && (
            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Code size={14} /> Technical Stack
              </h3>
              <div className="flex flex-wrap gap-2 pt-2">
                {data.skills.map(s => (
                  <span key={s} className="px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">{s}</span>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Verification Footer Stamp */}
      <footer className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center opacity-50">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ip&s IT Portfolio & Skill Wallet</span>
          <div className="h-4 w-px bg-slate-300"></div>
          <span className="text-[10px] font-medium text-slate-500 italic">This document is digitally verified.</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-blue-600">
          KMUTT Applied Computer Science
        </div>
      </footer>
    </div>
  );
};

// --- Helpers ---
const NavItem = ({ icon, label, active = false, isCollapsed = false, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center rounded-xl transition-all cursor-pointer group relative w-full ${isCollapsed ? 'justify-center h-12' : 'gap-4 px-4 py-3.5 h-[52px]'} ${active ? 'bg-white/5 text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
    <div className={`shrink-0 ${active ? 'text-[#ff4f40]' : 'group-hover:text-white transition-colors'}`}>{icon}</div>
    {!isCollapsed && <span className="text-sm font-bold truncate">{label}</span>}
    {active && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_#ff4f40]"></div>}
  </button>
);

const ConfigToggle = ({ label, sub, active, onClick }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
    <div className="text-left space-y-0.5">
      <p className="text-sm font-bold text-white group-hover:text-[#ff4f40] transition-colors leading-none">{label}</p>
      <p className="text-[10px] text-slate-500 font-medium mt-1.5 leading-none">{sub}</p>
    </div>
    <button onClick={onClick} className={`w-11 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-[#ff4f40]' : 'bg-[#1a1a1a]'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${active ? 'left-6' : 'left-1'}`}></div>
    </button>
  </div>
);