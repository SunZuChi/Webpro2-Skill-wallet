"use client";

import React, { useState, useMemo } from 'react';
import {
    Search,
    ShieldCheck,
    User as UserIcon,
    Award,
    ExternalLink,
    Clock,
    TrendingUp,
    ArrowLeft,
} from 'lucide-react';
import { AuthService } from '../../../services/auth.service';

export default function DirectoryPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTrack, setFilterTrack] = useState('all');
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
    
    // Data state
    const [studentsData, setStudentsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = await AuthService.getFreshToken();
                if (!token) return;
                
                const res = await fetch("http://localhost:3001/api/professor/students", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.status === "success") {
                    setStudentsData(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch students data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const processedStudents = useMemo(() => {
        return studentsData.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery);
            const matchFilter = filterTrack === 'all' || s.focus === filterTrack;
            return matchSearch && matchFilter;
        });
    }, [searchQuery, filterTrack, studentsData]);

    const selectedStudent = studentsData.find(s => s.id === selectedId);

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
        <div className="flex flex-1 overflow-hidden h-full text-left">

            {/* ── ROSTER PANEL ── */}
            <div className={`
                ${mobileView === 'list' ? 'flex' : 'hidden'}
                lg:flex
                w-full lg:w-95
                h-full bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0
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
                    <div className="flex items-center gap-1.5 flex-wrap justify-start content-start w-full">
                        {filterButtons.map(btn => {
                            const isActive = filterTrack === btn.id;
                            return (
                                <button key={btn.id} onClick={() => setFilterTrack(btn.id)}
                                    className={`cursor-pointer shrink-0 border px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none transition-all ${btn.id === 'all'
                                        ? isActive ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                                        : isActive ? (btn.activeClass || '') + ' border' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    {btn.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                    {isLoading ? (
                        <div className="py-20 text-center space-y-3 opacity-20">
                            <Clock size={40} className="mx-auto animate-spin" />
                            <p className="text-sm font-bold uppercase tracking-widest">Loading Directory...</p>
                        </div>
                    ) : processedStudents.length > 0 ? processedStudents.map(student => (
                        <div key={student.id} onClick={() => handleSelectStudent(student.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group relative overflow-hidden ${selectedId === student.id ? 'bg-[#121214] border border-white/10 shadow-2xl' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            {selectedId === student.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f40] rounded-r-md shadow-[0_0_10px_#ff4f40]" />
                            )}
                            <div className="flex items-center gap-3">
                                <img src={student.avatar} className="w-10 h-10 rounded-full border border-white/5 transition-all object-cover shrink-0" alt="avatar" />
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
            `}>
                {/* Mobile back button */}
                <button onClick={handleBackToList}
                    className="lg:hidden self-start flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold">
                    <ArrowLeft size={18} /> Back
                </button>

                {selectedStudent ? (
                    <div className="max-w-5xl w-full space-y-10 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pt-2 lg:pt-8">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 text-left">
                            <div className="flex items-center gap-5 md:gap-8">
                                <img src={selectedStudent.avatar} className="w-20 h-20 md:w-32 md:h-32 rounded-xl md:rounded-2xl border-2 border-white/5 shadow-2xl object-cover shrink-0" alt="S" />
                                <div className="space-y-2 md:space-y-3 min-w-0">
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">{selectedStudent.name}</h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">ID: {selectedStudent.id}</p>
                                </div>
                            </div>
                            <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center min-w-30 md:min-w-35 shadow-2xl shrink-0 self-start sm:self-auto">
                                <Award className="text-slate-600 mb-1" size={16} />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Badges</span>
                                <span className="text-3xl md:text-4xl font-black text-[#ff4f40] leading-none">{selectedStudent.badgesCount}</span>
                            </div>
                        </div>

                        {selectedStudent.summary && (
                            <p className="text-base md:text-xl text-slate-400 leading-relaxed max-w-3xl text-left border-l-4 border-[#ff4f40]/20 pl-5 md:pl-6">
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
                                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 animate-pulse">
                                        {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                                            <circle key={i} cx="50" cy="50" r={45 * r} fill="none" stroke="white" strokeWidth="0.3" />
                                        ))}
                                        <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.3" />
                                        <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.3" />
                                    </svg>
                                    {selectedStudent.matrix && (
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_30px_rgba(255,79,64,0.2)]">
                                            <polygon
                                                points={`
                                                    50,${50 - (selectedStudent.matrix.sw / 100) * 45}
                                                    ${50 + (selectedStudent.matrix.da / 100) * 45},50
                                                    50,${50 + (selectedStudent.matrix.gg / 100) * 45}
                                                    ${50 - (selectedStudent.matrix.cn / 100) * 45},50
                                                `}
                                                fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="0.8"
                                                className="animate-in zoom-in duration-1000"
                                            />
                                            <circle cx="50" cy={50 - (selectedStudent.matrix.sw / 100) * 45} r="1.5" fill="#3b82f6" />
                                            <circle cx={50 + (selectedStudent.matrix.da / 100) * 45} cy="50" r="1.5" fill="#f43f5e" />
                                            <circle cx="50" cy={50 + (selectedStudent.matrix.gg / 100) * 45} r="1.5" fill="#10b981" />
                                            <circle cx={50 - (selectedStudent.matrix.cn / 100) * 45} cy="50" r="1.5" fill="#eab308" />
                                        </svg>
                                    )}
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
                                        {selectedStudent.latestVerifications.map((v: any, idx: number) => (
                                            <div key={idx} className="p-5 md:p-7 flex items-center justify-between hover:bg-white/1 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-4 md:gap-6">
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