// controllers/verifier.controller.ts
import { db } from '../config/firebase-admin';

export const VerifierController = {

    // ── Feedback Management ─────────────────────────────────

    // ดู Feedback requests ทั้งหมด (filter ตาม status ได้)
    // status: 'all' | 'pending' | 'approved' | 'rejected'
    async getFeedbacks(status: string) {
        let query = db.collection('feedbacks').orderBy('created_at', 'desc') as FirebaseFirestore.Query;

        if (status !== 'all') {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.get();
        const feedbacks = snapshot.docs.map(d => d.data());
        return { status: 'success', count: feedbacks.length, feedbacks };
    },

    // ดูรายละเอียด Feedback คำขอเดียว (student evidence + criteria)
    async getFeedbackById(feedbackId: string) {
        const doc = await db.collection('feedbacks').doc(feedbackId).get();
        if (!doc.exists) return { status: 'error', message: 'ไม่พบคำขอ Feedback นี้', code: 404 };

        return { status: 'success', feedback: doc.data() };
    },

    // ── Student Directory ───────────────────────────────────

    // ดึงรายชื่อนักศึกษาทั้งหมด (role = 'user')
    // ค้นหา + filter ตาม skill category ได้
    async getStudents(search?: string, category?: string) {
        const snapshot = await db.collection('users')
            .where('auth.role', '==', 'user')
            .get();

        let students = snapshot.docs.map(doc => {
            const data = doc.data();
            const badges: any[] = data.achievements?.badges ?? [];

            // Primary skill = category ที่มี badge มากที่สุด
            const categoryCount: Record<string, number> = {};
            badges.forEach((b: any) => {
                const cat = b.skill ?? b.category ?? 'Other';
                categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
            });
            const primarySkill = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

            return {
                uid:           doc.id,
                name:          data.profile?.name ?? '',
                avatar_url:    data.profile?.avatar_url ?? '',
                location:      data.profile?.location ?? '',
                bio:           data.profile?.bio ?? '',
                badge_count:   badges.length,
                primary_skill: primarySkill,
            };
        });

        // Filter ตาม category ถ้ามี
        if (category && category !== 'all') {
            students = students.filter(s => s.primary_skill === category);
        }

        // ค้นหาด้วยชื่อหรือ uid
        if (search) {
            const q = search.toLowerCase();
            students = students.filter(s =>
                s.name.toLowerCase().includes(q) || s.uid.toLowerCase().includes(q)
            );
        }

        return { status: 'success', count: students.length, students };
    },

    // ดู Profile นักศึกษาแบบละเอียด (Verifier View)
    // รวม: profile + badges (พร้อม verification) + portfolio + history + latest feedback
    async getStudentDetail(uid: string) {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) return { status: 'error', message: 'ไม่พบนักศึกษานี้', code: 404 };

        const data = userDoc.data()!;
        if (data.auth?.role !== 'user') return { status: 'error', message: 'UID นี้ไม่ใช่นักศึกษา', code: 400 };

        // ดึง feedback history ของนักศึกษาคนนี้ด้วย
        const feedbackSnapshot = await db.collection('feedbacks')
            .where('student_id', '==', uid)
            .orderBy('updated_at', 'desc')
            .limit(10)
            .get();

        const feedbackHistory = feedbackSnapshot.docs.map(d => d.data());

        const badges: any[] = data.achievements?.badges ?? [];

        // คำนวณ Skill Matrix (นับ badge ตาม skill)
        const skillMatrix: Record<string, number> = {};
        badges.forEach((b: any) => {
            const skill = b.skill ?? 'Other';
            skillMatrix[skill] = (skillMatrix[skill] ?? 0) + 1;
        });

        return {
            status: 'success',
            uid,
            profile:      data.profile      ?? {},
            portfolio:    data.portfolio    ?? { projects: [] },
            history:      data.history      ?? { experience: [], education: [] },
            achievements: data.achievements ?? { badges: [] },
            skill_matrix:    skillMatrix,
            feedback_history: feedbackHistory,
        };
    },
};
