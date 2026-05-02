"use client";

import React, { useState, useMemo } from 'react';
import {
    Inbox,
    Users,
    Settings,
    AlignLeft,
    Search,
    LogOut,
    ShieldCheck,
    User as UserIcon,
    Award,
    ExternalLink,
    Clock,
    TrendingUp,
    X,
    ArrowLeft,
} from 'lucide-react';

import Link from 'next/link';

const STUDENTS_DATA = [
    {
        id: "000001",
        name: "Yosapart Raúl",
        focus: "SOFTWARE / WEB",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        badgesCount: 12,
        summary: "Passionate about scalable frontend architectures and modern web technologies. Currently focusing on React and Next.js ecosystems.",
        matrix: { sw: 90, da: 30, gg: 45, cn: 20 },
        latestVerifications: [
            { title: "Advanced React Hooks", date: "2 Feb 2026", status: "approved" },
            { title: "Tailwind CSS Layouts", date: "15 Jan 2026", status: "approved" }
        ]
    },
    {
        id: "000002",
        name: "Monpat Suksawat",
        focus: "DATA / AI",
        avatar: "https://i.pravatar.cc/100?u=monpat",
        badgesCount: 5,
        summary: "Specializing in big data processing and machine learning models. Keen on SQL optimization.",
        matrix: { sw: 20, da: 85, gg: 15, cn: 40 },
        latestVerifications: [
            { title: "SQL Complex Joins", date: "10 Feb 2026", status: "pending" }
        ]
    },
    {
        id: "000003",
        name: "Suttinun Rordorthai",
        focus: "CYBER / NETWORK",
        avatar: "https://i.pravatar.cc/100?u=suttinun",
        badgesCount: 15,
        summary: "Security researcher focusing on penetration testing and cloud infrastructure protection.",
        matrix: { sw: 35, da: 20, gg: 10, cn: 95 },
        latestVerifications: []
    },
    {
        id: "000004",
        name: "Sunday Konneua",
        focus: "CYBER / NETWORK",
        avatar: "https://i.pravatar.cc/100?u=sunday",
        badgesCount: 3,
        matrix: { sw: 10, da: 10, gg: 10, cn: 60 },
        latestVerifications: []
    },
    {
        id: "000005",
        name: "Thanakorn Kaboom",
        focus: "GAME / GRAPHICS",
        avatar: "https://i.pravatar.cc/100?u=thanakorn",
        badgesCount: 8,
        matrix: { sw: 40, da: 20, gg: 80, cn: 10 },
        latestVerifications: []
    },
    {
        id: "000006",
        name: "Apichet Pubgmaii",
        focus: "GAME / GRAPHICS",
        avatar: "https://i.pravatar.cc/100?u=apichet",
        badgesCount: 6,
        matrix: { sw: 30, da: 20, gg: 70, cn: 20 },
        latestVerifications: []
    }
];

export default function DirectoryPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTrack, setFilterTrack] = useState('all');
    const [showLogout, setShowLogout] = useState(false);
    // Mobile: 'list' | 'detail'
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
    // Mobile drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    const processedStudents = useMemo(() => {
        return STUDENTS_DATA.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery);
            const matchFilter = filterTrack === 'all' || s.focus === filterTrack;
            return matchSearch && matchFilter;
        });
    }, [searchQuery, filterTrack]);

    const selectedStudent = STUDENTS_DATA.find(s => s.id === selectedId);

    const handleSelectStudent = (id: string) => {
        setSelectedId(id);
        setMobileView('detail');
    };

    const handleBackToList = () => {
        setMobileView('list');
        setSelectedId(null);
    };

    const getTrackBadgeClass = (track: string) => {
        switch (track) {
            case 'SOFTWARE / WEB': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
            case 'DATA / AI': return 'text-[#ff4f40] border-[#ff4f40]/20 bg-[#ff4f40]/5';
            case 'CYBER / NETWORK': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
            case 'GAME / GRAPHICS': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
            default: return 'text-slate-400 border-white/10 bg-white/5';
        }
    };

    const filterButtons = [
        { id: 'all', label: 'All' },
        { id: 'SOFTWARE / WEB', label: 'SOFTWARE / WEB', activeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
        { id: 'DATA / AI', label: 'DATA / AI', activeClass: 'bg-[#ff4f40]/20 text-[#ff4f40] border-[#ff4f40]/40' },
        { id: 'CYBER / NETWORK', label: 'CYBER / NETWORK', activeClass: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' },
        { id: 'GAME / GRAPHICS', label: 'GAME / GRAPHICS', activeClass: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white text-left">

            {/* ── SIDEBAR (desktop lg+ only) ── */}
            <aside className={`hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'} h-full bg-[#0a0a0a] border-r border-white/5 flex-col py-8 shrink-0 z-100 transition-all duration-300 ease-in-out relative`}>
                <div className={`px-6 mb-12 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 focus:outline-none transition-colors cursor-pointer"
                    >
                        <AlignLeft size={24} />
                    </button>
                    {!isCollapsed && (
                        <span className="text-xl font-bold tracking-tighter">
                            <span className="text-[#ff4f40]">Ip</span>&s
                        </span>
                    )}
                </div>

                <nav className="flex flex-col w-full px-4 gap-2">
                    {/* Evaluation Inbox */}
                    <Link href='/professor/request'><div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm font-medium cursor-pointer group`}>
                        <Inbox size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate leading-none">Evaluation Inbox</span>}
                    </div></Link>
                    {/* Student Directory — active */}
                    <Link href='/professor/stu-directory'><div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm font-bold relative overflow-hidden group cursor-pointer transition-all`}>
                        {!isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]" />
                        )}
                        <Users size={20} className="text-[#ff4f40] shrink-0" />
                        {!isCollapsed && <span className="truncate leading-none">Student Directory</span>}
                    </div></Link>
                </nav>

                <div className="mt-auto px-4 flex flex-col gap-4 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowLogout(!showLogout)}
                            className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer group focus:outline-none`}
                        >
                            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                            {!isCollapsed && <span>Setting</span>}
                        </button>
                        {showLogout && (
                            <div className="absolute left-0 bottom-full mb-2 w-full min-w-30 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-110 animate-in slide-in-from-bottom-2">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-px bg-white/5 mx-2" />
                    <div className={`px-2 pb-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} group cursor-pointer`}>
                        <div className="relative shrink-0 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
                                className="w-11 h-11 rounded-full border-2 border-white/10 group-hover:border-[#ff4f40] transition-colors object-cover"
                                alt="Prof"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 flex-1">
                                <p className="text-sm font-bold text-white truncate leading-none">Dr. Wittawin</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5 opacity-60 leading-none">Professor</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* ── MOBILE / TABLET TOP BAR ── */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-[#0a0a0a] border-b border-white/5 h-14 flex items-center justify-between px-4">
                {mobileView === 'detail' ? (
                    <button onClick={handleBackToList} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-bold">Back</span>
                    </button>
                ) : (
                    <button onClick={() => setDrawerOpen(true)} className="p-2 -ml-1 text-slate-400 hover:text-white transition-colors">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                )}

                <span className="text-base font-bold tracking-tighter">
                    {mobileView === 'list'
                        ? <><span className="text-[#ff4f40]">Ip</span>&s</>
                        : <span className="text-xs font-bold text-slate-400 truncate max-w-45">{selectedStudent?.name}</span>
                    }
                </span>

                <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
                    className="w-8 h-8 rounded-full border border-white/10 object-cover"
                    alt="Prof"
                />
            </div>

            {/* ── MOBILE DRAWER SIDEBAR ── */}
            {drawerOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="lg:hidden fixed top-0 left-0 bottom-0 z-70 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-8 animate-in slide-in-from-left duration-200">
                        <div className="px-6 mb-12 flex items-center justify-between">
                            <span className="text-xl font-bold tracking-tighter"><span className="text-[#ff4f40]">Ip</span>&s</span>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <nav className="flex flex-col w-full px-4 gap-2">
                            <Link href='/professor/request'><div
                                onClick={() => setDrawerOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm font-medium cursor-pointer"
                            >
                                <Inbox size={20} className="shrink-0" />
                                <span className="truncate leading-none">Evaluation Inbox</span>
                            </div></Link>
                            <Link href='/professor/stu-directory'><div className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm font-bold relative overflow-hidden cursor-pointer">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]" />
                                <Users size={20} className="text-[#ff4f40] shrink-0" />
                                <span className="truncate leading-none">Student Directory</span>
                            </div></Link>
                        </nav>

                        <div className="mt-auto px-4 flex flex-col gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowLogout(!showLogout)}
                                    className="flex items-center w-full gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer focus:outline-none"
                                >
                                    <Settings size={20} />
                                    <span>Setting</span>
                                </button>
                                {showLogout && (
                                    <div className="absolute left-0 bottom-full mb-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-110">
                                        <button onClick={() => window.location.reload()} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="h-px bg-white/5 mx-2" />
                            <div className="px-2 pb-2 flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img
                                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
                                        className="w-10 h-10 rounded-full border-2 border-white/10 object-cover"
                                        alt="Prof"
                                    />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <p className="text-sm font-bold text-white truncate leading-none">Dr. Wittawin</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5 opacity-60 leading-none">Professor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}


            {/* ── MAIN ── */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* ── ROSTER PANEL ── */}
                <div className={`
                ${mobileView === 'list' ? 'flex' : 'hidden'}
                lg:flex
                w-full lg:w-95
                h-full bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0
                pt-14 lg:pt-0
                `}>
                    <div className="p-5 md:p-8 border-b border-white/5 space-y-4 md:space-y-6">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Directory</h1>

                        <div className="relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by ID or Name..."
                                className="w-full bg-[#121214] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-[#ff4f40]/50 transition-all"
                            />
                        </div>

                        {/* Filter buttons — same pattern as Request_Professor */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-start content-start w-full">
                            {filterButtons.map(btn => {
                                const isActive = filterTrack === btn.id;
                                return (
                                    <button
                                        key={btn.id}
                                        onClick={() => setFilterTrack(btn.id)}
                                        className={`cursor-pointer shrink-0 border px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none transition-all ${btn.id === 'all'
                                                ? isActive ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                                                : isActive ? btn.activeClass + ' border' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                                            }`}
                                    >
                                        {btn.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>



                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                        {processedStudents.length > 0 ? processedStudents.map(student => (
                            <div
                                key={student.id}
                                onClick={() => handleSelectStudent(student.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group relative overflow-hidden ${selectedId === student.id ? 'bg-[#121214] border border-white/10 shadow-2xl' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                {selectedId === student.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f40] rounded-r-md shadow-[0_0_10px_#ff4f40]" />
                                )}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={student.avatar}
                                        className="w-10 h-10 rounded-full border border-white/5  transition-all object-cover shrink-0"
                                        alt="avatar"
                                    />
                                    <div className="min-w-0">
                                        <p className={`text-sm font-bold truncate ${selectedId === student.id ? 'text-white' : 'text-slate-300'}`}>{student.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-none mt-1">ID: {student.id}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-0.5 rounded-md text-[8px] font-light uppercase tracking-tighter border shrink-0 ml-2 ${getTrackBadgeClass(student.focus)}`}>
                                    {student.focus}
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center space-y-3 opacity-20">
                                <Search size={40} className="mx-auto" />
                                <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
                            </div>
                        )}
                    </div>
                </div>


                {/* ── PROFILE DETAIL PANEL ── */}
                <div className={`
          ${mobileView === 'detail' ? 'flex' : 'hidden'}
          lg:flex
          flex-1 h-full overflow-y-auto custom-scrollbar bg-[#050505] p-6 md:p-8 lg:p-12 relative flex-col items-center
          pt-14 lg:pt-0
        `}>
                    {selectedStudent ? (
                        <div className="max-w-5xl w-full space-y-10 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pt-2 lg:pt-8">
                            {/* Profile Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 text-left">
                                <div className="flex items-center gap-5 md:gap-8">
                                    <img
                                        src={selectedStudent.avatar}
                                        className="w-20 h-20 md:w-32 md:h-32 rounded-xl md:rounded-2xl border-2 border-white/5 shadow-2xl object-cover shrink-0"
                                        alt="S"
                                    />
                                    <div className="space-y-2 md:space-y-3 min-w-0">
                                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">{selectedStudent.name}</h2>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">ID: {selectedStudent.id}</p>

                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center min-w-30 md:min-w-35 shadow-2xl shrink-0 self-start sm:self-auto">
                                    <Award className="text-slate-600 mb-1" size={16} />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Badges</span>
                                    <span className="text-3xl md:text-4xl font-black text-[#ff4f40] leading-none">{selectedStudent.badgesCount}</span>
                                </div>
                            </div>

                            {selectedStudent.summary && (
                                <p className="text-base md:text-xl text-slate-400 leading-relaxed max-w-3xl  text-left border-l-4 border-[#ff4f40]/20 pl-5 md:pl-6">
                                    "{selectedStudent.summary}"
                                </p>
                            )}

                            {/* Skill Matrix */}
                            <section className="space-y-4 md:space-y-6">
                                <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                                    Skill Matrix Analytics <div className="flex-1 h-px bg-white/5" />
                                </h3>
                                <div className="bg-[#0f0f11] border border-white/5 rounded-4xl md:rounded-[2.5rem] p-8 md:p-16 flex items-center justify-center min-h-90 md:min-h-130 relative shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-[#ff4f40]/5 blur-3xl rounded-full opacity-50" />
                                    <div className="relative w-full max-w-[320px] md:max-w-110 aspect-square flex items-center justify-center z-10">

                                        {/* SVG 1: Grid — pulse animation */}
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 animate-pulse">
                                            {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                                                <circle key={i} cx="50" cy="50" r={45 * r} fill="none" stroke="white" strokeWidth="0.3" />
                                            ))}
                                            <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.3" />
                                            <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.3" />
                                        </svg>

                                        {/* SVG 2: Polygon + dots */}
                                        {selectedStudent.matrix && (
                                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_30px_rgba(255,79,64,0.2)]">
                                                <polygon
                                                    points={`
                                                    50,${50 - (selectedStudent.matrix.sw / 100) * 45}
                                                    ${50 + (selectedStudent.matrix.da / 100) * 45},50
                                                    50,${50 + (selectedStudent.matrix.gg / 100) * 45}
                                                    ${50 - (selectedStudent.matrix.cn / 100) * 45},50
                                                    `}
                                                    fill="rgba(59, 130, 246, 0.3)"
                                                    stroke="#3b82f6"
                                                    strokeWidth="0.8"
                                                    className="animate-in zoom-in duration-1000"
                                                />
                                                <circle cx="50" cy={50 - (selectedStudent.matrix.sw / 100) * 45} r="1.5" fill="#3b82f6" />
                                                <circle cx={50 + (selectedStudent.matrix.da / 100) * 45} cy="50" r="1.5" fill="#f43f5e" />
                                                <circle cx="50" cy={50 + (selectedStudent.matrix.gg / 100) * 45} r="1.5" fill="#10b981" />
                                                <circle cx={50 - (selectedStudent.matrix.cn / 100) * 45} cy="50" r="1.5" fill="#eab308" />
                                            </svg>
                                        )}

                                        {/* Labels */}
                                        <div className="absolute top-0 text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.15em] md:tracking-[0.2em] -translate-y-4 text-center whitespace-nowrap">Software / Web</div>
                                        <div className="absolute bottom-0 text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em] md:tracking-[0.2em] translate-y-4 text-center whitespace-nowrap">Game / Graphics</div>
                                        <div className="absolute right-0 translate-x-16 md:translate-x-20 text-[9px] md:text-[10px] font-black text-[#ff4f40] uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Data / AI</div>
                                        <div className="absolute left-0 -translate-x-16 md:-translate-x-20 text-[9px] md:text-[10px] font-black text-yellow-500 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Cyber</div>
                                    </div>
                                </div>
                            </section>
                            {/* Latest Verification Activity */}
                            <section className="space-y-4 md:space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold flex items-center gap-3 text-white">Latest Verified Activity</h3>
                                    <button className="text-[10px] font-black text-[#ff4f40] uppercase tracking-widest hover:underline transition-all cursor-pointer">View All</button>
                                </div>
                                <div className="bg-[#0f0f11] border border-white/5 rounded-4xl overflow-hidden shadow-2xl text-left">
                                    {selectedStudent.latestVerifications && selectedStudent.latestVerifications.length > 0 ? (
                                        <div className="divide-y divide-white/5">
                                            {selectedStudent.latestVerifications.map((v, idx) => (
                                                <div key={idx} className="p-5 md:p-7 flex items-center justify-between hover:bg-white/1 transition-all cursor-pointer group">
                                                    <div className="flex items-center gap-4 md:gap-6 text-left">
                                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
                                                            <ShieldCheck size={20} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-bold text-base md:text-lg text-white group-hover:text-[#ff4f40] transition-colors leading-none">{v.title}</p>
                                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1 leading-none">
                                                                <Clock size={12} /> Verified On {v.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ExternalLink size={18} className="text-slate-700 group-hover:text-white transition-colors shrink-0" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-16 md:p-20 flex flex-col items-center justify-center opacity-20 gap-4">
                                            <TrendingUp size={64} strokeWidth={1} />
                                            <p className="text-xs uppercase font-black tracking-[0.3em]">No Verification Ledger Entry</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                        </div>
                    ) : (
                        /* Empty state — desktop only */
                        <div className="h-full flex-col items-center justify-center p-10 text-center animate-in fade-in duration-1000 hidden md:flex">
                            <div className="w-48 h-48 rounded-[3.5rem] bg-[#0f0f11] border border-white/5 flex items-center justify-center mb-10 shadow-2xl relative">
                                <div className="absolute inset-0 bg-[#ff4f40]/5 blur-3xl rounded-full" />
                                <UserIcon size={72} strokeWidth={0.5} className="text-slate-600 relative z-10" />
                            </div>
                            <div className="max-w-md space-y-6">
                                <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">Student Roster</h2>
                                <p className="text-xl text-slate-500 font-light leading-relaxed">
                                    Select a student from the directory on the left to analyze their skill progression.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fadeIn 0.4s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
        </div>
    );
}