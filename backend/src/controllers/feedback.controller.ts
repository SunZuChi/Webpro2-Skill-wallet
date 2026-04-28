// controllers/feedback.controller.ts
import { db } from '../config/firebase-admin';
import admin from 'firebase-admin';

const { FieldValue } = admin.firestore;

type Criteria = { name: string; score: number };

export const FeedbackController = {

    // [Student] ส่งคำขอ Feedback
    async submitRequest(body: {
        badge_id:     string;
        badge_name:   string;
        skill:        string;
        level:        string;
        category:     string;
        issuer?:      string;
        evidence_url?: string;
        note?:        string;
    }, uid: string, studentName: string) {
        const feedbackId = `fb_${Date.now()}_${uid}`;

        await db.collection('feedbacks').doc(feedbackId).set({
            feedback_id:      feedbackId,
            student_id:       uid,
            student_name:     studentName,
            badge_id:         body.badge_id,
            badge_name:       body.badge_name,
            skill:            body.skill,
            level:            body.level,
            category:         body.category,
            issuer:           body.issuer ?? 'KMUTT',
            evidence_url:     body.evidence_url ?? '',
            note:             body.note ?? '',
            status:           'pending',
            verifier_id:      null,
            verifier_name:    null,
            verifier_comment: null,
            evaluation:       null,
            created_at:       new Date().toISOString(),
            updated_at:       new Date().toISOString(),
        });

        return { status: 'success', message: 'ส่งคำขอ Feedback สำเร็จ กรุณารอการยืนยันจากอาจารย์', feedback_id: feedbackId };
    },

    // [Student] ดูคำขอของตัวเอง
    async getMyRequests(uid: string) {
        const snapshot = await db.collection('feedbacks')
            .where('student_id', '==', uid)
            .orderBy('created_at', 'desc')
            .get();
        return { status: 'success', feedbacks: snapshot.docs.map(d => d.data()) };
    },

    // [Verifier] ดูคำขอที่รอการยืนยัน
    async getPending() {
        const snapshot = await db.collection('feedbacks')
            .where('status', '==', 'pending')
            .orderBy('created_at', 'asc')
            .get();
        const feedbacks = snapshot.docs.map(d => d.data());
        return { status: 'success', count: feedbacks.length, feedbacks };
    },

    // [Verifier] Approve + มอบ Badge อัตโนมัติ + บันทึก review_history
    async approve(feedbackId: string, verifierUid: string, verifierName: string, comment: string, criteria: Criteria[]) {
        const feedbackRef = db.collection('feedbacks').doc(feedbackId);
        const feedbackDoc = await feedbackRef.get();

        if (!feedbackDoc.exists) return { status: 'error', message: 'ไม่พบคำขอ Feedback นี้', code: 404 };
        const fd = feedbackDoc.data()!;
        if (fd.status !== 'pending') return { status: 'error', message: `คำขอนี้ถูกดำเนินการไปแล้ว (สถานะ: ${fd.status})`, code: 400 };

        const now = new Date().toISOString();
        const evaluation = { criteria };

        // 1) อัปเดต feedback doc
        await feedbackRef.update({
            status: 'approved', verifier_id: verifierUid, verifier_name: verifierName,
            verifier_comment: comment, evaluation, updated_at: now,
        });

        // 2) สร้าง Badge และยัดเข้า Student
        const badge = {
            badge_id:   fd.badge_id,
            badge_name: fd.badge_name,
            skill:      fd.skill,
            level:      fd.level,
            issuer:     fd.issuer ?? 'KMUTT',
            status:     'approved',
            issued_at:  now,
            verification: {
                verifier_id:   verifierUid,
                verifier_name: verifierName,
                comment,
                verified_at:   now,
                evaluation,
            },
        };

        await db.collection('users').doc(fd.student_id).update({
            'achievements.badges': FieldValue.arrayUnion(badge),
        });

        // 3) บันทึก review_history ให้อาจารย์
        await db.collection('users').doc(verifierUid).update({
            review_history: FieldValue.arrayUnion({
                user_id: fd.student_id, badge_id: fd.badge_id,
                feedback_id: feedbackId, evaluation, comment, created_at: now,
            }),
        });

        return {
            status: 'success',
            message: `✅ Approved! Badge "${fd.badge_name}" ถูกมอบให้ ${fd.student_name} แล้ว`,
            badge,
        };
    },

    // [Verifier] Reject + ให้ Feedback กลับ + บันทึก review_history
    async reject(feedbackId: string, verifierUid: string, verifierName: string, comment: string, criteria: Criteria[]) {
        const feedbackRef = db.collection('feedbacks').doc(feedbackId);
        const feedbackDoc = await feedbackRef.get();

        if (!feedbackDoc.exists) return { status: 'error', message: 'ไม่พบคำขอ Feedback นี้', code: 404 };
        const fd = feedbackDoc.data()!;
        if (fd.status !== 'pending') return { status: 'error', message: `คำขอนี้ถูกดำเนินการไปแล้ว (สถานะ: ${fd.status})`, code: 400 };

        const now = new Date().toISOString();
        const evaluation = { criteria };

        await feedbackRef.update({
            status: 'rejected', verifier_id: verifierUid, verifier_name: verifierName,
            verifier_comment: comment, evaluation, updated_at: now,
        });

        await db.collection('users').doc(verifierUid).update({
            review_history: FieldValue.arrayUnion({
                user_id: fd.student_id, badge_id: fd.badge_id,
                feedback_id: feedbackId, evaluation, comment, created_at: now,
            }),
        });

        return { status: 'success', message: `❌ Rejected คำขอของ ${fd.student_name} — อาจารย์ได้ให้ feedback กลับแล้ว` };
    },

    // [Verifier] ดูประวัติที่ตัวเอง approve/reject
    async getMyReviews(verifierUid: string) {
        const snapshot = await db.collection('feedbacks')
            .where('verifier_id', '==', verifierUid)
            .orderBy('updated_at', 'desc')
            .get();
        const feedbacks = snapshot.docs.map(d => d.data());
        return { status: 'success', count: feedbacks.length, feedbacks };
    },
};
