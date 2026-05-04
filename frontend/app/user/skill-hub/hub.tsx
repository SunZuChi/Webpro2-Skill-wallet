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
import { SkillHubService, UserProfile } from '@/services/skill-hub.service';
import { AuthService, DEFAULT_AVATAR } from '../../../services/auth.service';
import { auth, storage } from '../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProjectService, ProjectData } from '../../../services/project.service';
import { BadgeService } from '../../../services/badge.service';
import { ExperienceService } from '@/services/experience.service';
import { EducationService } from '@/services/education.service';

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
  // ... (keep existing)
];

export default function App() {
  const [activeTab, setActiveTab] = useState('skillhub');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Data States
  const [pinnedBadgeIds, setPinnedBadgeIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [isBadgesLoading, setIsBadgesLoading] = useState(true);
  const [allBadgesCatalog, setAllBadgesCatalog] = useState<any[]>([]);

  const fetchProfile = async () => {
    const data = await SkillHubService.getMyProfile();
    if (data) {
      setProfile(data);
      setPinnedBadgeIds(data.pinned_badges || []);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsProjectsLoading(true);
      const res = await ProjectService.getMyProjects();
      console.log("Fetch Projects Response:", res);
      if (res.status === "success") {
        setProjects(res.data);
      } else {
        console.error("Failed to fetch projects:", res.message);
      }
    } catch (error) {
      console.error("Error in fetchProjects:", error);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const fetchUserBadges = async () => {
    try {
      setIsBadgesLoading(true);
      const res = await BadgeService.getMyEnrichedRequests();
      
      if (res.status === "success") {
        setUserBadges(res.data);
        if (res.catalog) setAllBadgesCatalog(res.catalog);
      }
    } catch (error) {
      console.error("Failed to fetch user badges:", error);
    } finally {
      setIsBadgesLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchUserBadges();
  }, []);

  const togglePin = async (id: string) => {
    const newPinned = pinnedBadgeIds.includes(id)
      ? pinnedBadgeIds.filter(bid => bid !== id)
      : pinnedBadgeIds.length < 4 
        ? [...pinnedBadgeIds, id] 
        : pinnedBadgeIds;

    if (newPinned !== pinnedBadgeIds) {
      setPinnedBadgeIds(newPinned);
      // บันทึกลง Database ทันที
      await SkillHubService.updatePinnedBadges(newPinned);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'skillhub':
        return (
          <SkillHubView
            profile={profile}
            onOpenBadgeModal={() => setActiveModal('badge-select')}
            onAddProject={() => { setEditingData(null); setActiveModal('project-submit'); }}
            onPreviewProject={(p: any) => { setEditingData(p); setActiveModal('project-preview'); }}
            onEditProfile={() => setActiveModal('profile')}
            onAddExperience={(data: any) => { setEditingData(data || null); setActiveModal('experience'); }}
            onAddEducation={(data: any) => { setEditingData(data || null); setActiveModal('education'); }}
            pinnedBadgeIds={pinnedBadgeIds}
            togglePin={togglePin}
            projects={projects}
            isLoading={isProjectsLoading}
            badges={userBadges}
            isBadgesLoading={isBadgesLoading}
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
      <BadgeSelectModal 
        isOpen={activeModal === 'badge-select'} 
        onClose={() => setActiveModal(null)} 
        pinnedIds={pinnedBadgeIds} 
        togglePin={togglePin} 
        badges={userBadges} 
      />
      <SubmissionModal
        isOpen={activeModal === 'project-submit'}
        onClose={() => setActiveModal(null)}
        type="project"
        initialData={editingData}
        onRefresh={fetchProjects}
      />
      <ProjectPreviewModal
        isOpen={activeModal === 'project-preview'}
        onClose={() => setActiveModal(null)}
        project={editingData}
        onEdit={() => setActiveModal('project-submit')}
        onRefresh={fetchProjects}
      />
      <ProfileEditModal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        profile={profile}
        onRefresh={fetchProfile}
      />
      <TimelineEditModal 
        isOpen={activeModal === 'experience' || activeModal === 'education'} 
        onClose={() => setActiveModal(null)} 
        type={activeModal === 'experience' ? 'experience' : 'education'} 
        initialData={editingData} 
        onRefresh={fetchProfile}
      />

    </>
  );
}

// ==========================================
// VIEW: SKILL HUB
// ==========================================
const SkillHubView = ({ profile, onOpenBadgeModal, onAddProject, onPreviewProject, onEditProfile, onAddExperience, onAddEducation, pinnedBadgeIds, togglePin, projects, isLoading, badges, isBadgesLoading }: any) => {
  // กรองเฉพาะ Badge ที่ถูก Pin ไว้มาแสดงในหน้าหลัก
  const displayBadges = badges.filter((b: any) => pinnedBadgeIds.includes(b.id));

  return (
    <div className={`${CONTAINER_CLASS} py-8 md:py-10 space-y-14 animate-in fade-in duration-700`}>

      {/* SECTION: Profile Banner */}
      <section>
        <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl group">
          <div className="h-32 md:h-48 bg-gradient-to-r from-[#1a1a1a] via-[#ff4f40]/10 to-[#1a1a1a]"></div>
          <div className="px-8 md:px-12 pb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 mb-8">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-3xl bg-[#0f0f11] border-4 border-[#050505] shadow-2xl overflow-hidden shrink-0">
                <img
                  src={profile?.profile?.avatar_url || DEFAULT_AVATAR}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 md:pb-2 text-left">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{profile?.profile?.name || 'Yosapart Raúl'}</h2>
                  <button onClick={onEditProfile} className="p-3 bg-white/5 hover:bg-[#ff4f40] hover:text-white rounded-2xl transition-all text-slate-400 group">
                    <Edit3 size={18} />
                  </button>
                </div>
                <p className={`font-bold text-sm md:text-base uppercase tracking-wider ${profile?.profile?.headline ? 'text-[#ff4f40]' : 'text-slate-700 italic opacity-50'}`}>
                  {profile?.profile?.headline || 'Not specified'}
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6 pt-2 text-slate-500 text-xs sm:text-sm font-medium">
                  <span className={`flex items-center gap-2 ${!profile?.profile?.location && 'opacity-40 italic'}`}>
                    <MapPin size={14} /> {profile?.profile?.location || 'Not specified'}
                  </span>
                  <span className={`flex items-center gap-2 underline decoration-white/10 ${!profile?.email && 'opacity-40 italic'}`}>
                    <Mail size={14} /> {profile?.email || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-px bg-white/5 w-full mb-8"></div>
            <div className="space-y-4 text-left">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">About Me</h3>
              <p className={`text-sm md:text-base leading-relaxed max-w-5xl font-light ${profile?.profile?.bio ? 'text-slate-400' : 'text-slate-700 italic opacity-50'}`}>
                {profile?.profile?.bio || 'No information provided yet.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Featured Projects */}
      <section className="space-y-8">
        <div className="flex items-center gap-3"><FolderOpen className="text-[#ff4f40]" size={24} /><h3 className="text-2xl font-bold tracking-tight text-white">Featured Projects</h3></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {projects.map((project: any) => (
            <div key={project.id} onClick={() => onPreviewProject(project)} className="bg-[#0f0f11] border border-white/5 rounded-[2.2rem] flex flex-col min-h-[360px] hover:border-[#ff4f40]/30 transition-all cursor-pointer group relative overflow-hidden shadow-xl">
              <div className="h-48 bg-black/40 relative overflow-hidden">
                <img src={project.cover_image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60" alt={project.title} />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">Project</div>
              </div>
              <div className="p-8 flex-1 flex flex-col text-left">
                <h4 className="font-bold text-xl leading-tight mb-3 group-hover:text-[#ff4f40] transition-colors text-white">{project.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-3 font-light leading-relaxed mb-6">{project.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <div className="flex gap-2">
                    {project.tech_stack?.map((t: string) => <span key={t} className="px-2 py-1 rounded-md bg-white/5 text-slate-400 text-[9px] font-bold uppercase">{t}</span>)}
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-[#ff4f40] transition-all transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}

          {isLoading && [1, 2].map(i => (
            <div key={i} className="bg-[#0f0f11] border border-white/5 rounded-[2.2rem] min-h-[360px] animate-pulse"></div>
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
          {isBadgesLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#0f0f11] border border-white/5 rounded-[2.2rem] min-h-[340px] animate-pulse"></div>
            ))
          ) : displayBadges.length > 0 ? displayBadges.map((badge: any) => (
            <div key={badge.id} className="bg-[#0f0f11] border border-white/5 shadow-2xl rounded-[2.2rem] p-8 flex flex-col min-h-[340px] group transition-all hover:border-[#ff4f40]/40 relative animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                {badge.icon ? (
                  <img src={badge.icon} className="w-10 h-10 object-contain" alt="badge icon" />
                ) : (
                  <Medal className="text-slate-700" size={32} />
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-[#ff4f40] transition-colors leading-tight">{badge.badge_name || badge.title}</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400">{badge.category}</span>
                  <span className={`inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 ${badge.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500' : badge.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {badge.status || 'pending'}
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                    {badge.profImg ? <img src={badge.profImg} className="w-full h-full object-cover" alt="Prof" /> : <User size={14} className="text-slate-600" />}
                  </div>
                  <div className="flex flex-col text-left">
                    {badge.status === 'verified' ? (
                      <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-extrabold uppercase tracking-tighter leading-none"><ShieldCheck size={10} /> Verified</div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-500 text-[9px] font-extrabold uppercase tracking-tighter leading-none"><Clock size={10} /> {badge.status || 'Pending'}</div>
                    )}
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{badge.prof || 'Professor'}</p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          )) : (
            <div onClick={onOpenBadgeModal} className="col-span-full bg-[#050505] border-2 border-dashed border-white/5 rounded-[2.2rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/20 transition-all shadow-inner min-h-[200px]">
              <Pin size={32} className="text-slate-600 mb-4" />
              <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">No Badges Selected</h4>
              <p className="text-[10px] text-slate-600 mt-2">Click "View All" to select badges to showcase on your profile</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION: Experience & Education */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 text-left">
        {/* Experience Column */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Briefcase className="text-[#ff4f40]" size={24} /><h3 className="text-2xl font-bold tracking-tight text-white">Experience</h3></div>
            <button onClick={() => onAddExperience()} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#ff4f40] transition-all flex items-center justify-center text-white shadow-lg transform active:scale-90"><Plus size={20} /></button>
          </div>
          <div className="space-y-6">
            {profile?.experience?.length > 0 ? profile.experience.map((exp: any) => (
              <div key={exp.id} className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-8 min-h-[280px] flex flex-col justify-between hover:border-[#ff4f40]/20 transition-all group shadow-xl relative overflow-hidden text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xl text-white">{exp.organization}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{exp.start_year} - {exp.end_year || 'Present'}</span>
                  </div>
                  <p className="text-[#ff4f40] font-bold text-sm">{exp.title}</p>
                  {exp.description && <p className="text-slate-500 text-sm font-light leading-relaxed">{exp.description}</p>}
                </div>
                <div className="pt-6 border-t border-white/5 text-right">
                  <button onClick={() => onAddExperience(exp)} className="text-[10px] font-black text-slate-500 hover:text-[#ff4f40] uppercase tracking-widest flex items-center gap-1 transition-all ml-auto font-bold">EDIT <ChevronRight size={12} /></button>
                </div>
              </div>
            )) : (
              <div className="bg-[#0f0f11] border border-dashed border-white/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center opacity-30 min-h-[280px]">
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">No Experience Added Yet</h3>
              </div>
            )}
          </div>
        </div>

        {/* Education Column */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><GraduationCap className="text-[#ff4f40]" size={24} /><h3 className="text-2xl font-bold tracking-tight text-white">Education</h3></div>
            <button onClick={() => onAddEducation()} className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#ff4f40] transition-all flex items-center justify-center text-white shadow-lg transform active:scale-90"><Plus size={20} /></button>
          </div>
          <div className="space-y-6">
            {profile?.education?.length > 0 ? profile.education.map((edu: any) => (
              <div key={edu.id} className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-8 min-h-[280px] flex flex-col justify-between hover:border-[#ff4f40]/20 transition-all group shadow-xl relative overflow-hidden text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xl text-white">{edu.organization}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{edu.start_year} - {edu.end_year || 'Present'}</span>
                  </div>
                  <p className="text-[#ff4f40] font-bold text-sm">{edu.title}</p>
                  {edu.description && <p className="text-slate-500 text-sm font-light leading-relaxed">{edu.description}</p>}
                </div>
                <div className="pt-6 border-t border-white/5 text-right">
                  <button onClick={() => onAddEducation(edu)} className="text-[10px] font-black text-slate-500 hover:text-[#ff4f40] uppercase tracking-widest flex items-center gap-1 transition-all ml-auto font-bold">EDIT <ChevronRight size={12} /></button>
                </div>
              </div>
            )) : (
              <div className="bg-[#0f0f11] border border-dashed border-white/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center opacity-30 min-h-[280px]">
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">No Education Added Yet</h3>
              </div>
            )}
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

const ProjectPreviewModal = ({ isOpen, onClose, project, onEdit, onRefresh }: any) => {
  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      const res = await ProjectService.deleteProject(project.id);
      if (res.status === "success") {
        if (onRefresh) onRefresh();
        onClose();
      } else {
        alert("Failed to delete project: " + res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">

        {/* Banner Area */}
        <div className="h-64 sm:h-96 w-full relative">
          <img src={project.cover_image} className="w-full h-full object-cover" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>

          {/* Top Actions */}
          <div className="absolute top-8 left-8 flex gap-3">
            <button onClick={handleDelete} className="p-3 bg-red-500/20 hover:bg-red-500 border border-red-500/30 rounded-full text-red-500 hover:text-white transition-all shadow-xl group">
              <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#ff4f40] transition-all group z-50 shadow-xl">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content Area - Overlapping Banner */}
        <div className="flex-1 overflow-y-auto p-10 sm:p-14 custom-scrollbar -mt-20 relative z-10">

          {/* Title & Buttons Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {(project.tech_stack || []).map((t: string) => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-[#ff4f40]/10 text-[#ff4f40] text-[10px] font-black uppercase tracking-widest border border-[#ff4f40]/20">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                {project.title}
              </h2>
            </div>

            <div className="flex gap-4">
              <a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-white">
                <GithubIcon size={20} />
              </a>
              <a href={project.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="p-4 bg-[#ff4f40] hover:bg-[#e53e30] rounded-2xl transition-all text-white shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 font-bold text-sm">
                Live Demo <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  Project Description <div className="h-px flex-1 bg-white/5"></div>
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed font-light">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Metadata Box */}
            <div className="space-y-8">
              <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest text-white">Metadata</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Status</span>
                    <span className="text-emerald-500 font-bold text-sm">{project.status || 'Completed'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Year</span>
                    <span className="text-white font-bold text-sm">{project.year || '2026'}</span>
                  </div>
                </div>
                <button
                  onClick={onEdit}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-sm font-bold flex items-center justify-center gap-2 text-white"
                >
                  <Edit3 size={16} /> Edit Details
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionModal = ({ isOpen, onClose, type, initialData, onRefresh }: any) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.cover_image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || []);
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);

  const formRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setImagePreview(initialData?.cover_image || null);
      setTechStack(initialData?.tech_stack || []);
      setSelectedFile(null);
      setLoading(false);
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()]);
      }
      setTechInput('');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload รูปภาพก่อน (ถ้ามีไฟล์ใหม่)
      let coverImageUrl = imagePreview || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80";

      if (selectedFile) {
        console.log("Step 1: Uploading image via /project/upload...");
        coverImageUrl = await ProjectService.uploadImage(selectedFile);
        console.log("Image uploaded successfully:", coverImageUrl);
      }

      // Step 2: สร้าง/แก้ไข Project ด้วย JSON
      console.log("Step 2: Saving project data...");
      const data = {
        title: (formRef.current.elements as any).title.value,
        description: (formRef.current.elements as any).description.value,
        tech_stack: techStack,
        cover_image: coverImageUrl
      };

      let res;
      if (initialData?.id) {
        res = await ProjectService.updateProject(initialData.id, data);
      } else {
        res = await ProjectService.createProject(data);
      }

      console.log("Project saved:", res);
      if (res.status === "success") {
        if (onRefresh) onRefresh();
        onClose();
      } else {
        alert("Failed to save project: " + (res.message || JSON.stringify(res)));
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      alert("Submission failed: " + (err.message || "Please check your connection"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">
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
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-black/50 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center relative group overflow-hidden hover:border-[#ff4f40]/30 transition-all cursor-pointer"
            >
              {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-3 text-slate-600"><Upload size={40} /><p className="text-xs font-bold uppercase tracking-widest">Click to upload cover</p></div>}
              {imagePreview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                </div>
              )}
            </div>
          </section>
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300"><Cpu size={20} className="text-[#ff4f40]" /> Tech Stack</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input type="text" placeholder="Add tech (Enter to add)..." className="flex-1 bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech} />
                <button type="button" onClick={() => { if (techInput.trim()) setTechStack([...techStack, techInput.trim()]); setTechInput(''); }} className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold transition-all text-white">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map(t => <span key={t} className="px-4 py-2 rounded-xl bg-[#ff4f40]/10 text-[#ff4f40] text-[10px] font-black uppercase tracking-widest border border-[#ff4f40]/20 flex items-center gap-2 animate-in zoom-in">{t} <X size={12} className="cursor-pointer" onClick={() => setTechStack(techStack.filter(item => item !== t))} /></span>)}
              </div>
            </div>
          </section>
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300"><Edit3 size={20} className="text-[#ff4f40]" /> Project Details</h3>
            <div className="space-y-6">
              <input name="title" type="text" placeholder="Project Title..." defaultValue={initialData?.title} className="w-full bg-black/50 border border-white/5 rounded-2xl px-8 py-5 text-xl font-bold focus:border-[#ff4f40]/50 outline-none text-white shadow-inner" />
              <textarea name="description" placeholder="Description..." defaultValue={initialData?.description} className="w-full bg-black/50 border border-white/5 rounded-3xl p-8 text-sm min-h-[180px] outline-none focus:border-[#ff4f40]/50 transition-all italic font-light leading-relaxed placeholder:text-slate-800 text-white shadow-inner" />
            </div>
          </section>
        </div>
        <div className="p-8 border-t border-white/5 bg-[#0f0f11] flex justify-end gap-6">
          <button type="button" onClick={onClose} className="px-8 py-3 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Discard</button>
          <button type="submit" disabled={loading} className="bg-[#ff4f40] text-white font-extrabold px-12 py-4 rounded-[1.5rem] shadow-xl uppercase tracking-widest text-[10px] transform active:scale-95 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Confirm Submission'}
          </button>
        </div>
      </form>
    </div>
  );
};

const BadgeSelectModal = ({ isOpen, onClose, pinnedBadgeIds, togglePin, badges }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0f0f11]">
          <div>
            <h2 className="text-2xl font-bold text-white">Select Featured Badges</h2>
            <p className="text-sm text-slate-500 mt-1">Pin up to <span className="text-white font-bold">4 badges</span></p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-slate-400"><X size={28} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge: any) => {
            const isPinned = pinnedBadgeIds.includes(badge.id);
            const isFull = pinnedBadgeIds.length >= 4 && !isPinned;
            return (
              <div 
                key={badge.id} 
                onClick={() => !isFull && togglePin(badge.id)} 
                className={`p-8 rounded-[2.5rem] border transition-all relative group cursor-pointer ${isPinned ? 'bg-[#ff4f40]/5 border-[#ff4f40]/40 shadow-2xl' : isFull ? 'opacity-30 grayscale cursor-not-allowed border-white/5' : 'bg-[#121214] border-white/5 hover:border-white/10'}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden ${isPinned ? 'bg-[#ff4f40]/20' : 'bg-white/5'}`}>
                    {badge.icon ? (
                      <img src={badge.icon} className="w-10 h-10 object-contain" />
                    ) : (
                      <Medal className="text-slate-700" size={24} />
                    )}
                  </div>
                  <div className={`p-2 rounded-xl transition-all ${isPinned ? 'bg-[#ff4f40] text-white scale-110 shadow-lg' : 'bg-white/5 text-slate-600'}`}>
                    {isPinned ? <Pin size={16} fill="currentColor" /> : <Plus size={16} />}
                  </div>
                </div>
                <h4 className="font-bold text-xl mb-2 text-white">{badge.badge_name || badge.title}</h4>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${isPinned ? 'text-[#ff4f40]' : 'text-slate-500'}`}>
                  {badge.category}
                </p>
                <div className="pt-5 border-t border-white/5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                    {badge.profImg ? <img src={badge.profImg} className="w-full h-full object-cover" /> : <User size={12} className="text-slate-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{badge.prof || 'Professor'}</span>
                </div>
                {isPinned && (
                  <div className="absolute bottom-0 right-0 p-4 bg-[#ff4f40] rounded-tl-[1.5rem] rounded-br-[2.5rem] shadow-xl">
                    <Check size={14} strokeWidth={4} className="text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-8 border-t border-white/5 bg-[#0f0f11] flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">
            <span className="text-white font-bold">{pinnedBadgeIds.length}/4</span> Selected
          </span>
          <button onClick={onClose} className="bg-white text-black font-extrabold px-12 py-4 rounded-[1.5rem] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs shadow-xl transform active:scale-95">
            Save Selection
          </button>
        </div>
      </div>
    </div>
  );
};

const TimelineEditModal = ({ isOpen, onClose, type, initialData, onRefresh }: any) => {
  const [formData, setFormData] = useState({
    organization: '',
    title: '',
    start_year: '',
    end_year: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        organization: initialData.organization || '',
        title: initialData.title || '',
        start_year: initialData.start_year || '',
        end_year: initialData.end_year || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({ organization: '', title: '', start_year: '', end_year: '', description: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;
  const isEdu = type === 'education';

  const handleSubmit = async () => {
    setLoading(true);
    let success = false;
    const service = isEdu ? EducationService : ExperienceService;
    if (initialData?.id) {
      success = await service.update(initialData.id, formData);
    } else {
      success = await service.add(formData);
    }

    if (success) {
      onRefresh();
      onClose();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      setLoading(true);
      const service = isEdu ? EducationService : ExperienceService;
      const success = await service.delete(initialData.id);
      if (success) {
        onRefresh();
        onClose();
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 text-left">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3 capitalize text-white">
            {isEdu ? <GraduationCap className="text-[#ff4f40]" /> : <Briefcase className="text-[#ff4f40]" />} 
            {initialData ? 'Edit' : 'Add'} {type}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X size={20} /></button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isEdu ? "University / School" : "Company / Organization"}</label>
            <input 
              type="text" 
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e.target.value})}
              placeholder={isEdu ? "e.g. KMUTT" : "e.g. Google Thailand"} 
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isEdu ? "Degree / Major" : "Job Title / Position"}</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={isEdu ? "e.g. B.Sc. Applied Computer Science" : "e.g. Software Engineer Intern"} 
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Start Year</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                <input 
                  type="text" 
                  value={formData.start_year}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, start_year: val});
                  }}
                  placeholder="2021" 
                  className="w-full bg-black border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-center text-white" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">End Year</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                <input 
                  type="text" 
                  value={formData.end_year === 'Present' ? '' : formData.end_year}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, end_year: val});
                  }}
                  placeholder="Present" 
                  className="w-full bg-black border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-center text-white" 
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Optional)</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder={isEdu ? "Briefly describe your focus..." : "Briefly describe your role and achievements..."}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner h-32 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <div>
            {initialData && (
              <button onClick={handleDelete} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Cancel</button>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-white text-black font-extrabold px-10 py-4 rounded-[1.5rem] shadow-xl uppercase tracking-widest text-[10px] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileEditModal = ({ isOpen, onClose, profile, onRefresh }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    location: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.profile?.name || '',
        headline: profile.profile?.headline || '',
        bio: profile.profile?.bio || '',
        location: profile.profile?.location || '',
        avatar_url: profile.profile?.avatar_url || ''
      });
    }
  }, [profile, isOpen]);

  const handleSave = async () => {
    setLoading(true);
    const success = await SkillHubService.updateProfile(formData);
    setLoading(false);
    if (success) {
      if (onRefresh) onRefresh();
      onClose();
    } else {
      alert('Failed to update profile');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 text-left">
        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-black border border-white/5 rounded-2xl p-6 text-sm min-h-[120px] focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
            />
          </div>
        </div>
        <div className="flex justify-end gap-6 pt-6 border-t border-white/5">
          <button onClick={onClose} className="px-6 py-3 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">Cancel</button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-white text-black font-extrabold px-10 py-4 rounded-[1.5rem] shadow-xl uppercase tracking-widest text-[10px] disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

