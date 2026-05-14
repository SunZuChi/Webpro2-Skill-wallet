"use client";

import React, { useState, useMemo } from 'react';
import {
    Clock,
    RotateCcw,
    ShieldCheck,
    MoreVertical,
    Search,
    CheckCircle2,
    MessageSquare,
    FileText,
    Check,
    Download,
    CheckSquare,
    Square,
    Inbox as InboxIcon,
    ArrowLeft,
} from 'lucide-react';
import { FeetbackService } from '../../../services/feetback.service';

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

const CATEGORY_COLOR: Record<string, string> = {
    "SOFTWARE / WEB": "bg-blue-500/10 border border-blue-500/20 text-blue-500",
    "DATA / AI": "bg-rose-500/10 border border-rose-500/20 text-rose-500",
    "CYBER / NETWORK": "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
    "GAME / GRAPHICS": "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500",
};

// Helper function to format time ago
const timeAgo = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + " seconds ago";
};

export default function Request_Professor() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [criteriaStates, setCriteriaStates] = useState<Record<string, boolean>>({});
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
    const [requestsData, setRequestsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        const found = requestsData.find(r => r.id === selectedId);
        if (found) {
            setComment(found.comment || "");
            const initialStates: Record<string, boolean> = {};
            if (found.result && found.result.length > 0) {
                found.result.forEach((c: any, idx: number) => {
                    initialStates[`c_${idx}`] = !!c.passed;
                });
                setCriteriaStates(initialStates);
            } else {
                setCriteriaStates({});
            }
        } else {
            setComment("");
            setCriteriaStates({});
        }
    }, [selectedId, requestsData]);

    const handleSubmitFeedback = async (status: 'approved' | 'revisions' | 'rejected') => {
        const found = requestsData.find(r => r.id === selectedId);
        if (!found) return;

        setIsSubmitting(true);
        try {
            const res = await FeetbackService.submitFeedback(
                found.id,
                status,
                comment,
                criteriaStates
            );

            if (res.status === "success") {
                alert(`Successfully marked request as ${status}`);

                // Update local list state so UI updates immediately
                setRequestsData(prev => prev.map(req => {
                    if (req.id === found.id) {
                        return {
                            ...req,
                            status: status,
                            comment: comment,
                            result: req.rawCriteria.map((c: any, idx: number) => ({
                                ...c,
                                passed: !!criteriaStates[`c_${idx}`]
                            }))
                        };
                    }
                    return req;
                }));

                if (window.innerWidth < 1024) {
                    handleBackToList();
                }
            } else {
                alert(`Error submitting evaluation: ${res.message || "Unknown error"}`);
            }
        } catch (error: any) {
            alert(`Failed to submit: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    React.useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                
                const res = await fetch("http://localhost:3001/api/professor/badge-requests", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.status === "success") {
                    // Map backend data to UI format
                    const mappedData = data.data.map((req: any) => {
                        // Extract filename from URL or use a default
                        let fileName = "evidence-file";
                        if (req.evidence_link) {
                            try {
                                const urlObj = new URL(req.evidence_link);
                                const pathnameParts = urlObj.pathname.split('/');
                                fileName = pathnameParts[pathnameParts.length - 1] || "evidence-file";
                            } catch (e) {
                                fileName = "evidence-file";
                            }
                        }

                        // Generate a short name
                        const nameParts = (req.student_name || "Student").split(" ");
                        const shortName = nameParts.length > 1 
                            ? `${nameParts[0]} ${nameParts[1].charAt(0)}.` 
                            : nameParts[0];

                        // Use the exact URL from Cloudinary without modification
                        let downloadLink = req.evidence_link || "";

                        return {
                            id: req.id,
                            student: shortName,
                            studentFull: req.student_name || "Unknown Student",
                            studentId: req.user_id.substring(0, 6).toUpperCase(), // Use start of user_id as ID
                            avatar: req.student_avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                            badge: req.badge_name,
                            category: req.category,
                            status: req.status,
                            submittedAt: timeAgo(req.created_at),
                            evidenceText: req.description,
                            evidenceLink: downloadLink,
                            fileName: fileName,
                            fileSize: req.evidence_link ? "Uploaded" : "No file",
                            rawCriteria: req.criteria || [],
                            comment: req.comment || "",
                            result: req.result || []
                        };
                    });
                    
                    setRequestsData(mappedData);
                }
            } catch (err) {
                console.error("Failed to fetch badge requests:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const processedRequests = useMemo(() => {
        const filtered = requestsData.filter(item => {
            const matchesSearch =
                item.studentFull.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.badge.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
        const statusOrder: Record<string, number> = { pending: 1, revisions: 2, approved: 3 };
        return [...filtered].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }, [searchQuery, filterStatus, requestsData]);

    const selectedRequest = requestsData.find(r => r.id === selectedId);

    // Get criteria to display (either from the specific request, or fallback to MASTER_CRITERIA if none exist)
    const displayCriteria = selectedRequest?.rawCriteria?.length > 0 
        ? selectedRequest.rawCriteria.map((c: any, idx: number) => ({ 
            id: `c_${idx}`, 
            label: c.name || c.label || (typeof c === 'string' ? c : 'Criterion'), 
            desc: c.description || c.desc || '' 
        })) 
        : (MASTER_CRITERIA[selectedRequest?.category || ""] || []);

    const toggleCriteria = (id: string) => {
        setCriteriaStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectRequest = (id: string) => {
        setSelectedId(id);
        setMobileView('detail');
    };

    const handleBackToList = () => {
        setMobileView('list');
        setSelectedId(null);
    };

    return (
        <div className="flex flex-1 overflow-hidden h-full text-left">

            {/* ── QUEUE PANEL ── */}
            <div className={`
                ${mobileView === 'list' ? 'flex' : 'hidden'}
                lg:flex
                w-full lg:w-95
                h-full bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0
            `}>
                {/* Mobile back button row */}
                <div className="lg:hidden flex items-center gap-2 px-5 pt-4 pb-0">
                    {/* intentionally empty — back is handled by topbar */}
                </div>

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

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        <button onClick={() => setFilterStatus('all')}
                            className={`${filterStatus === 'all' ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'} cursor-pointer shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none transition-all`}
                        >All</button>
                        <button onClick={() => setFilterStatus('approved')}
                            className={`${filterStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-emerald-500/10`}
                        ><CheckCircle2 size={10} /> Approved</button>
                        <button onClick={() => setFilterStatus('pending')}
                            className={`${filterStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-yellow-500/10`}
                        ><Clock size={10} /> Pending</button>
                        <button onClick={() => setFilterStatus('revisions')}
                            className={`${filterStatus === 'revisions' ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-rose-500/10`}
                        ><RotateCcw size={10} /> Revisions</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {isLoading ? (
                        <div className="py-20 text-center space-y-3 opacity-20">
                            <Clock size={40} className="mx-auto animate-spin" />
                            <p className="text-sm font-bold uppercase tracking-widest">Loading Requests...</p>
                        </div>
                    ) : processedRequests.length > 0 ? processedRequests.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleSelectRequest(item.id)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedId === item.id ? 'bg-[#121214] border-white/10 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                        >
                            {selectedId === item.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f40] rounded-r-md shadow-[0_0_10px_#ff4f40]" />}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border leading-none ${CATEGORY_COLOR[item.category] ?? 'bg-white/5 text-slate-400 border-white/10'}`}>
                                        {item.category}
                                    </span>
                                    <div className={`p-1 rounded-md border ${item.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : item.status === 'revisions' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                                        {item.status === 'approved' ? <ShieldCheck size={10} /> : item.status === 'revisions' ? <RotateCcw size={10} /> : <Clock size={10} />}
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-600 font-bold uppercase leading-none">{item.submittedAt}</span>
                            </div>
                            <h3 className={`text-sm font-bold leading-tight mb-3 transition-colors ${selectedId === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{item.badge}</h3>
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
            `}>
                {/* Mobile: back button inside detail */}
                <button
                    onClick={handleBackToList}
                    className="lg:hidden flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold"
                >
                    <ArrowLeft size={18} /> Back
                </button>

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
                                    <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest leading-none flex items-center gap-1.5 ${selectedRequest.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : selectedRequest.status === 'revisions' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                        {selectedRequest.status === 'approved' ? <ShieldCheck size={10} /> : <Clock size={10} />} {selectedRequest.status} Review
                                    </div>
                                </div>
                            </div>
                            <button className="hidden md:block p-3 hover:bg-white/5 rounded-full transition-colors text-slate-600"><MoreVertical size={20} /></button>
                        </div>

                        {/* Evidence */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                                <FileText size={16} className="text-[#ff4f40]" /> Student Evidence <div className="flex-1 h-px bg-white/5" />
                            </h3>
                            <div className="bg-[#0f0f11] border border-white/5 rounded-3xl p-6 md:p-10 space-y-8 md:space-y-10 shadow-2xl">
                                <p className="text-base text-slate-300 leading-relaxed font-semibold text-left">"{selectedRequest.evidenceText}"</p>
                                <a 
                                    href={selectedRequest.evidenceLink || "#"} 
                                    target={selectedRequest.evidenceLink ? "_blank" : "_self"} 
                                    rel="noopener noreferrer"
                                    onClick={(e) => { if (!selectedRequest.evidenceLink) e.preventDefault(); }}
                                    className={`bg-[#050505] border border-white/5 rounded-2xl p-5 md:p-6 flex items-center justify-between transition-all shadow-inner block w-full ${selectedRequest.evidenceLink ? 'group hover:border-[#ff4f40]/30 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${selectedRequest.evidenceLink ? 'bg-[#ff4f40]/5 text-[#ff4f40]' : 'bg-white/5 text-slate-500'}`}>
                                            <FileText size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h4 className={`font-bold text-sm transition-colors leading-none ${selectedRequest.evidenceLink ? 'text-white group-hover:text-[#ff4f40]' : 'text-slate-500'}`}>
                                                {selectedRequest.evidenceLink ? selectedRequest.fileName : "No file attached"}
                                            </h4>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase mt-2 leading-none">
                                                {selectedRequest.evidenceLink ? "Uploaded Project File" : "No Evidence File"}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedRequest.evidenceLink && (
                                        <Download size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                                    )}
                                </a>
                            </div>
                        </section>

                        {/* Criteria */}
                        {displayCriteria.length > 0 && (
                            <section className="space-y-6">
                                <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                                    <CheckCircle2 size={16} className="text-[#ff4f40]" /> Evaluation Criteria <div className="flex-1 h-px bg-white/5" />
                                </h3>
                                <div className="bg-[#0f0f11] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                    {displayCriteria.map((c: any, i: number) => (
                                        <div key={c.id} onClick={() => toggleCriteria(c.id)}
                                            className={`p-6 md:p-8 flex items-start gap-5 md:gap-6 group hover:bg-white/1 transition-colors cursor-pointer ${i !== displayCriteria.length - 1 ? 'border-b border-white/5' : ''}`}>
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
                                <MessageSquare size={16} className="text-[#ff4f40]" /> Official Feedback <div className="flex-1 h-px bg-white/5" />
                            </h3>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Write constructive feedback for the student..."
                                className="w-full bg-[#0f0f11] border border-white/5 rounded-3xl font-semibold p-6 md:p-10 text-base min-h-40 md:min-h-50 outline-none focus:border-[#ff4f40]/50 transition-all leading-relaxed placeholder:text-slate-500 text-white shadow-inner disabled:opacity-50"
                            />
                        </section>

                        {/* Action buttons */}
                        <div className="sticky bottom-0 pt-8 pb-6 mt-10 bg-linear-to-t from-[#050505] to-transparent z-20 flex justify-end gap-3 md:gap-4">
                            <button 
                                onClick={() => handleSubmitFeedback('revisions')}
                                disabled={isSubmitting}
                                className="cursor-pointer uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 md:px-10 py-3.5 md:py-4 rounded-2xl font-semibold flex items-center gap-2 md:gap-3 transition-all active:scale-95 text-[12px] md:text-[14px] tracking-widest shadow-xl disabled:opacity-50"
                            >
                                <RotateCcw size={15} /> Revisions
                            </button>
                            <button 
                                onClick={() => handleSubmitFeedback('approved')}
                                disabled={isSubmitting}
                                className="cursor-pointer uppercase bg-[#059669] hover:bg-[#10b981] text-white px-6 md:px-10 py-3.5 md:py-4 rounded-2xl font-semibold flex items-center gap-2 md:gap-3 transition-all active:scale-95 text-[12px] md:text-[14px] tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : <><Check size={18} strokeWidth={4} /> Approve Badge</>}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Welcome screen */
                    <div className="h-full flex-col items-center justify-center p-10 text-center animate-in fade-in duration-1000 hidden md:flex">
                        <div className="w-48 h-48 rounded-[3rem] bg-[#0f0f11] border border-white/5 flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.02)] mb-10 relative">
                            <InboxIcon size={80} strokeWidth={0.5} className="text-slate-700" />
                            <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#ff4f40] rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-12">
                                <ShieldCheck size={28} />
                            </div>
                        </div>
                        <div className="max-w-2xl space-y-6">
                            <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">Evaluation Inbox</h2>
                            <p className="text-lg text-slate-500 leading-relaxed font-light">
                                You have <span className="text-[#ff4f40] font-black">{requestsData.filter(r => r.status === 'pending').length} pending submissions</span> waiting for your review today.
                                <br />Select an item from the queue on the left to begin evaluating student credentials.
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