"use client";

import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    Inbox,
    Users,
    Settings,
    AlignLeft,
    Clock,
    RotateCcw,
    ShieldCheck,
    Quote,
    ChevronRight,
    ExternalLink,
    MoreVertical,
    LogOut,
    Search,
    CheckCircle2,
    XCircle,
    MessageSquare,
    FileText,
    Filter,
    Check,
    X,
    Download,
    Paperclip,
    CheckSquare,
    Square,
    User as UserIcon,
    Inbox as InboxIcon,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

import Link from 'next/link';

const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

const MASTER_CRITERIA: Record<string, any[]> = {
    "SOFTWARE / WEB": [
        { id: 'sw1', label: 'Basic HTML Tags Usage', desc: 'ใช้แท็กพื้นฐาน (<h1>, <p>, <img>, <ul>) ได้ถูกต้องตามหลัก Semantics' },
        { id: 'sw2', label: 'File Linking & Attributes', desc: 'การเชื่อมโยง src และ href ทำงานได้ปกติ ไม่มี Broken links' },
        { id: 'sw3', label: 'Code Formatting', desc: 'การจัดย่อหน้าโค้ดเป็นระเบียบและอ่านง่ายตามมาตรฐาน' },
    ],
    "DATA / AI": [
        { id: 'da1', label: 'Query Correctness', desc: 'ผลลัพธ์การ Query ถูกต้องตามโจทย์กำหนด' },
        { id: 'da2', label: 'Database Schema Design', desc: 'การออกแบบตารางและความสัมพันธ์มีความเหมาะสม' },
        { id: 'da3', label: 'Join Optimization', desc: 'เลือกใช้ Join ประเภทต่างๆ ได้อย่างมีประสิทธิภาพ' },
    ],
    "GAME / GRAPHICS": [
        { id: 'gg1', label: 'User Flow Clarity', desc: 'ลำดับการใช้งานของแอปพลิเคชันมีความเป็นเหตุเป็นผล' },
        { id: 'gg2', label: 'Visual Hierarchy', desc: 'การจัดวางองค์ประกอบศิลป์เน้นจุดสำคัญได้ถูกต้อง' },
        { id: 'gg3', label: 'Component Consistency', desc: 'การใช้สีและฟอนต์มีความสม่ำเสมอทั้งโปรเจกต์' },
    ]
};

// Category color map ตาม CATEGORIES ที่กำหนด
const CATEGORY_COLOR: Record<string, string> = {
    "SOFTWARE / WEB": "bg-blue-500/10 border border-blue-500/20 text-blue-500",
    "DATA / AI": "bg-rose-500/10 border border-rose-500/20 text-rose-500",
    "CYBER / NETWORK": "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
    "GAME / GRAPHICS": "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500",
};

const REQUESTS_DATA = [
    {
        id: 1,
        student: "Yosapart R.",
        studentFull: "Yosapart Raúl",
        studentId: "000001",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        badge: "Simple HTML Profile Page",
        category: "SOFTWARE / WEB",
        status: "pending",
        submittedAt: "2 hours ago",
        evidenceText: "อาจารย์ครับ ผมเขียนหน้าเว็บโปรไฟล์แนะนำตัวด้วย HTML พื้นฐานตามแบบฝึกหัดบทที่ 1 เรียบร้อยแล้วครับ มีการใส่รูปภาพและทำลิงก์ไปที่ Facebook ด้วย ฝากตรวจด้วยครับ",
        fileName: "first-html-page.zip",
        fileSize: "234KB",
    },
    {
        id: 2,
        student: "Monpat T.",
        studentFull: "Monpat T.",
        studentId: "000002",
        avatar: "https://i.pravatar.cc/100?u=monpat",
        badge: "Basic SQL SELECT Queries",
        category: "DATA / AI",
        status: "pending",
        submittedAt: "5h ago",
        evidenceText: "ส่งงาน Lab 3 เรื่อง SQL Join และ Select ครับ มีการจัดการ ER Diagram มาด้วยครับ",
        fileName: "sql-lab3.sql",
        fileSize: "12KB",
    },
    {
        id: 3,
        student: "Thanakorn K.",
        studentFull: "Thanakorn K.",
        studentId: "000003",
        avatar: "https://i.pravatar.cc/100?u=thanakorn",
        badge: "Basic App Wireframe (Figma)",
        category: "GAME / GRAPHICS",
        status: "revisions",
        submittedAt: "1d ago",
        evidenceText: "Figma Link for the mobile shop app prototype.",
        fileName: "figma-export.pdf",
        fileSize: "1.2MB",
    },
    {
        id: 4,
        student: "Chanon W.",
        studentFull: "Chanon Wittaya",
        studentId: "000004",
        avatar: "https://i.pravatar.cc/100?u=chanon",
        badge: "React Components Mastery",
        category: "SOFTWARE / WEB",
        status: "approved",
        submittedAt: "3d ago",
        evidenceText: "ส่งงาน React Functional Components และ Hooks ครับ",
        fileName: "react-hooks-lab.zip",
        fileSize: "450KB",
    }
];

const CATEGORIES = [
    { id: 'all', label: 'All', color: 'bg-white text-black' },
    { id: 'software', label: 'SOFTWARE / WEB', color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
    { id: 'data', label: 'DATA / AI', color: 'bg-rose-500/10 border-rose-500/20 text-rose-500' },
    { id: 'cyber', label: 'CYBER / NETWORK', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
    { id: 'game', label: 'GAME / GRAPHICS', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
];

export default function Request_Professor() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [showLogout, setShowLogout] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [criteriaStates, setCriteriaStates] = useState<Record<string, boolean>>({});
    // Mobile/iPad: 'list' | 'detail'
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
    // Mobile/iPad drawer sidebar
    const [drawerOpen, setDrawerOpen] = useState(false);

    const processedRequests = useMemo(() => {
        const filtered = REQUESTS_DATA.filter(item => {
            const matchesSearch =
                item.studentFull.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.badge.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
        const statusOrder: Record<string, number> = { approved: 1, pending: 2, revisions: 3 };
        return [...filtered].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }, [searchQuery, filterStatus]);

    const selectedRequest = REQUESTS_DATA.find(r => r.id === selectedId);

    const toggleCriteria = (id: string) => {
        setCriteriaStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectRequest = (id: number) => {
        setSelectedId(id);
        setMobileView('detail');
    };

    const handleBackToList = () => {
        setMobileView('list');
        setSelectedId(null);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white text-left">

            {/* ── SIDEBAR (desktop lg+ only) ── */}
            <aside className={`hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'} h-full bg-[#0a0a0a] border-r border-white/5 flex-col py-8 shrink-0 z-100 transition-all duration-300 ease-in-out relative`}>
                <div className={`px-6 mb-12 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 focus:outline-none transition-colors cursor-pointer">
                        <AlignLeft size={24} />
                    </button>
                    {!isCollapsed && <span className="text-xl font-bold tracking-tighter"><span className="text-[#ff4f40]">Ip</span>&s</span>}
                </div>

                <nav className="flex flex-col w-full px-4 gap-2">
                    <Link href='/professor/request'><div
                        onClick={() => { setSelectedId(null); }}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm font-bold relative overflow-hidden group cursor-pointer transition-all`}
                    >
                        {!isCollapsed && !selectedId && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]"></div>}
                        <Inbox size={20} className="text-[#ff4f40] shrink-0" />
                        {!isCollapsed && <span className="truncate leading-none">Evaluation Inbox</span>}
                    </div></Link>
                    <Link href='/professor/stu-directory'><div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm font-medium cursor-pointer group`}>
                        <Users size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate leading-none">Student Directory</span>}
                    </div></Link>
                </nav>

                <div className="mt-auto px-4 flex flex-col gap-4 relative">
                    <div className="relative">
                        <button onClick={() => setShowLogout(!showLogout)} className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer group focus:outline-none`}>
                            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                            {!isCollapsed && <span>Setting</span>}
                        </button>
                        {showLogout && (
                            <div className="absolute left-0 bottom-full mb-2 w-full min-w-30 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-60 animate-in slide-in-from-bottom-2">
                                <button onClick={() => window.location.reload()} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-px bg-white/5 mx-2"></div>
                    <div className={`px-2 pb-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} group cursor-pointer`}>
                        <div className="relative shrink-0 shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" className="w-11 h-11 rounded-full border-2 border-white/10 group-hover:border-[#ff4f40] transition-colors object-cover" alt="Prof" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]"></span>
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
                {/* Left: hamburger OR back */}
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

                {/* Center: logo or badge title */}
                <div className="flex items-center gap-2">
                    {mobileView === 'list' && (
                        <span className="text-base font-bold tracking-tighter"><span className="text-[#ff4f40]">Ip</span>&s</span>
                    )}
                    {mobileView === 'detail' && selectedRequest && (
                        <span className="text-xs font-bold text-slate-400 truncate max-w-45">{selectedRequest.badge}</span>
                    )}
                </div>

                {/* Right: avatar */}
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="Prof" />
            </div>

            {/* ── MOBILE / TABLET DRAWER SIDEBAR ── */}
            {drawerOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                        onClick={() => setDrawerOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="lg:hidden fixed top-0 left-0 bottom-0 z-70 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-8 animate-in slide-in-from-left duration-200">
                        {/* Header */}
                        <div className="px-6 mb-12 flex items-center justify-between">
                            <span className="text-xl font-bold tracking-tighter"><span className="text-[#ff4f40]">Ip</span>&s</span>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Nav */}
                        <nav className="flex flex-col w-full px-4 gap-2">
                            <Link href='/professor/request'><div
                                onClick={() => { setSelectedId(null); setMobileView('list'); setDrawerOpen(false); }}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm font-bold relative overflow-hidden cursor-pointer"
                            >
                                
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]" />
                                <Inbox size={20} className="text-[#ff4f40] shrink-0" />
                                <span className="truncate leading-none">Evaluation Inbox</span>
                            </div></Link>
                            <Link href='/professor/stu-directory'><div className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm font-medium cursor-pointer">
                                <Users size={20} className="shrink-0" />
                                <span className="truncate leading-none">Student Directory</span>
                            </div></Link>
                        </nav>

                        {/* Bottom */}
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
                                    <div className="absolute left-0 bottom-full mb-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-60">
                                        <button onClick={() => window.location.reload()} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="h-px bg-white/5 mx-2" />
                            <div className="px-2 pb-2 flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" className="w-10 h-10 rounded-full border-2 border-white/10 object-cover" alt="Prof" />
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
            <main className="flex-1 overflow-hidden relative flex flex-col transition-all duration-300 pt-0 md:pt-0">
                <div className="flex-1 flex overflow-hidden h-full">

                    {/* ── QUEUE PANEL ── */}
                    <div className={`
            ${mobileView === 'list' ? 'flex' : 'hidden'}
            lg:flex
            w-full  lg:w-95
            h-full bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0
            pt-14 lg:pt-0
          `}>
                        <div className="p-5 md:p-8 border-b border-white/5 space-y-4 md:space-y-6 pt-7 md:pt-8">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Request Badge</h1>

                            <div className="relative">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search student or badge..."
                                    className="w-full bg-[#121214] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-[#ff4f40]/50 transition-all"
                                />
                            </div>

                            {/* Filter buttons */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`${filterStatus === 'all' ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'} cursor-pointer shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none transition-all`}
                                >All</button>
                                <button
                                    onClick={() => setFilterStatus('approved')}
                                    className={`${filterStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-emerald-500/10`}
                                ><CheckCircle2 size={10} /> Approved</button>
                                <button
                                    onClick={() => setFilterStatus('pending')}
                                    className={`${filterStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-yellow-500/10`}
                                ><Clock size={10} /> Pending</button>
                                <button
                                    onClick={() => setFilterStatus('revisions')}
                                    className={`${filterStatus === 'revisions' ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-rose-500/10`}
                                ><RotateCcw size={10} /> Revisions</button>
                            </div>
                        </div>

                        {/* Request list */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                            {processedRequests.length > 0 ? processedRequests.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelectRequest(item.id)}
                                    className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedId === item.id ? 'bg-[#121214] border-white/10 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                >
                                    {selectedId === item.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f40] rounded-r-md shadow-[0_0_10px_#ff4f40]"></div>}

                                    <div className="flex justify-between items-start mb-4 text-left">
                                        <div className="flex items-center gap-1.5">
                                            {/* Category badge — ใช้สีตาม CATEGORY_COLOR */}
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border leading-none ${CATEGORY_COLOR[item.category] ?? 'bg-white/5 text-slate-400 border-white/10'}`}>
                                                {item.category}
                                            </span>
                                            {/* Status icon */}
                                            <div className={`p-1 rounded-md border ${item.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                    item.status === 'revisions' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                                        'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                                }`}>
                                                {item.status === 'approved' ? <ShieldCheck size={10} /> : item.status === 'revisions' ? <RotateCcw size={10} /> : <Clock size={10} />}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-bold uppercase leading-none">{item.submittedAt}</span>
                                    </div>

                                    <h3 className={`text-sm font-bold leading-tight mb-3 text-left transition-colors ${selectedId === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{item.badge}</h3>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img src={item.avatar} className="w-6 h-6 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt="S" />
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors leading-none">{item.student}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-600 flex items-center gap-1 font-bold tracking-tighter uppercase leading-none"><FileText size={10} /> 1 File</span>
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



                    {/* ── DETAIL PANEL ── */}
                    <div className={`
        ${mobileView === 'detail' ? 'flex' : 'hidden'}
        lg:flex
        flex-1 h-full overflow-y-auto custom-scrollbar bg-[#050505] p-8 lg:p-12 relative flex-col
        pt-14 lg:pt-0
        `}>
                        {selectedRequest ? (
                            <div className="max-w-5xl w-full space-y-10 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pt-2 lg:pt-8">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-4 text-left">
                                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">{selectedRequest.badge}</h2>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                                <img src={selectedRequest.avatar} className="w-6 h-6 rounded-full border border-white/10" alt="student" />
                                                <span className="text-sm font-bold text-slate-300">{selectedRequest.studentFull}</span>
                                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider ml-2 opacity-50">ID: {selectedRequest.studentId}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                                <Clock size={14} className="text-slate-600" />
                                                <span className="text-xs font-bold text-slate-400 tracking-widest leading-none mt-0.5">Submitted {selectedRequest.submittedAt}</span>
                                            </div>
                                            <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest leading-none flex items-center gap-1.5 ${selectedRequest.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                    selectedRequest.status === 'revisions' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {selectedRequest.status === 'approved' ? <ShieldCheck size={10} /> : <Clock size={10} />} {selectedRequest.status} Review
                                            </div>
                                        </div>
                                    </div>
                                    <button className="hidden md:block p-3 hover:bg-white/5 rounded-full transition-colors text-slate-600"><MoreVertical size={20} /></button>
                                </div>

                                {/* Evidence */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                                        <FileText size={16} className="text-[#ff4f40]" /> Student Evidence <div className="flex-1 h-px bg-white/5"></div>
                                    </h3>
                                    <div className="bg-[#0f0f11] border border-white/5 rounded-3xl p-6 md:p-10 space-y-8 md:space-y-10 shadow-2xl">
                                        <p className="text-base text-slate-300 leading-relaxed font-semibold text-left">"{selectedRequest.evidenceText}"</p>
                                        <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 md:p-6 flex items-center justify-between group hover:border-[#ff4f40]/30 transition-all cursor-pointer shadow-inner">
                                            <div className="flex items-center gap-4 md:gap-5">
                                                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#ff4f40]/5 rounded-xl flex items-center justify-center text-[#ff4f40]">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-bold text-sm text-white group-hover:text-[#ff4f40] transition-colors leading-none">{selectedRequest.fileName}</h4>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase mt-2 leading-none">{selectedRequest.fileSize} • Uploaded Project File</p>
                                                </div>
                                            </div>
                                            <Download size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </section>

                                {/* Criteria */}
                                {(MASTER_CRITERIA[selectedRequest.category] || []).length > 0 && (
                                    <section className="space-y-6">
                                        <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                                            <CheckCircle2 size={16} className="text-[#ff4f40]" /> Evaluation Criteria <div className="flex-1 h-px bg-white/5"></div>
                                        </h3>
                                        <div className="bg-[#0f0f11] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                            {MASTER_CRITERIA[selectedRequest.category].map((c, i) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => toggleCriteria(c.id)}
                                                    className={`p-6 md:p-8 flex items-start gap-5 md:gap-6 group hover:bg-white/1 transition-colors cursor-pointer ${i !== MASTER_CRITERIA[selectedRequest.category].length - 1 ? 'border-b border-white/5' : ''}`}
                                                >
                                                    <button className={`mt-1 shrink-0 transition-all transform active:scale-90 ${criteriaStates[c.id] ? 'text-emerald-500' : 'text-slate-800 group-hover:text-slate-600'}`}>
                                                        {criteriaStates[c.id] ? <CheckSquare size={24} /> : <Square size={24} />}
                                                    </button>
                                                    <div className="text-left space-y-1.5 flex-1">
                                                        <h4 className={`font-bold text-md leading-tight transition-colors ${criteriaStates[c.id] ? 'text-white' : 'text-slate-400'}`}>{c.label}</h4>
                                                        <p className="text-xs text-slate-400 leading-relaxed font-light">{c.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Feedback */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                                        <MessageSquare size={16} className="text-[#ff4f40]" /> Official Feedback <div className="flex-1 h-px bg-white/5"></div>
                                    </h3>
                                    <textarea
                                        placeholder="Write constructive feedback for the student..."
                                        className="w-full bg-[#0f0f11] border border-white/5 rounded-3xl font-semibold p-6 md:p-10 text-base min-h-40 md:min-h-50 outline-none focus:border-[#ff4f40]/50 transition-all leading-relaxed placeholder:text-slate-500 text-white shadow-inner"
                                    />
                                </section>

                                {/* Action buttons */}
                                <div className="sticky bottom-0 pt-8 pb-6 mt-10 bg-linear-to-t from-[#050505] to-transparent z-20 flex justify-end gap-3 md:gap-4">
                                    <button className="cursor-pointer uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 md:px-10 py-3.5 md:py-4 rounded-2xl font-semibold flex items-center gap-2 md:gap-3 transition-all active:scale-95 text-[12px] md:text-[14px] tracking-widest shadow-xl">
                                        <RotateCcw size={15} /> Revisions
                                    </button>
                                    <button className="cursor-pointer uppercase bg-[#059669] hover:bg-[#10b981] text-white px-6 md:px-10 py-3.5 md:py-4 rounded-2xl font-semibold flex items-center gap-2 md:gap-3 transition-all active:scale-95 text-[12px] md:text-[14px] tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                                        <Check size={18} strokeWidth={4} /> Approve Badge
                                    </button>
                                </div>
                            </div>
                        ) : (



                            /* Welcome screen — desktop only */
                            <div className="h-full flex-col items-center justify-center p-10 text-center animate-in fade-in duration-1000 hidden md:flex">
                                <div className="w-48 h-48 rounded-[3rem] bg-[#0f0f11] border border-white/5 flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.02)] mb-10 relative">
                                    <InboxIcon size={80} strokeWidth={0.5} className="text-slate-700" />
                                    <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#ff4f40] rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-12">
                                        <ShieldCheck size={28} />
                                    </div>
                                </div>
                                <div className="max-w-2xl space-y-6">
                                    <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">Welcome, Dr. Wittawin</h2>
                                    <p className="text-lg text-slate-500 leading-relaxed font-light">
                                        You have <span className="text-[#ff4f40] font-black">{REQUESTS_DATA.filter(r => r.status === 'pending').length} pending submissions</span> waiting for your review today.
                                        <br />Select an item from the queue on the left to begin evaluating student credentials.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

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