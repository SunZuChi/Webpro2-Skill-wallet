// api/feedback.route.ts
import { Elysia, t } from 'elysia';
import { isUserMiddleware, isVerifierMiddleware } from '../middleware/auth.middleware';
import { FeedbackController } from '../controllers/feedback.controller';

// ── Schema ─────────────────────────────────────────────────
const CriteriaSchema = t.Object({
    name:  t.String({ description: 'เกณฑ์ เช่น "Basic HTML Tags Usage"' }),
    score: t.Number({ description: '0 = ไม่ผ่าน, 1 = ผ่าน', minimum: 0, maximum: 1 }),
});

// helper ดึงชื่ออาจารย์/นักศึกษาจาก context
const getName = (user: any) =>
    user?.profile?.name ?? user?.auth?.name ?? 'Unknown';

// ── [Student] Routes ───────────────────────────────────────
const studentRoutes = new Elysia({ prefix: '/api/feedback' })
    .use(isUserMiddleware)

    .post('/request', async ({ body, user, set }) => {
        try {
            return await FeedbackController.submitRequest(body, user.uid, getName(user));
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            badge_id:     t.String({ description: 'รหัส Badge เช่น b1' }),
            badge_name:   t.String({ description: 'ชื่อ Badge เช่น React Developer' }),
            skill:        t.String({ description: 'ทักษะหลัก เช่น React' }),
            level:        t.String({ description: 'Beginner / Intermediate / Advanced' }),
            category:     t.String({ description: 'หมวดหมู่ เช่น SOFTWARE / WEB' }),
            issuer:       t.Optional(t.String()),
            evidence_url: t.Optional(t.String({ description: 'Link ผลงาน/หลักฐาน' })),
            note:         t.Optional(t.String({ description: 'หมายเหตุถึงอาจารย์' })),
        }),
        detail: { tags: ['Feedback'], summary: '[Student] ส่งคำขอให้อาจารย์ยืนยันทักษะ' }
    })

    .get('/my-requests', async ({ user, set }) => {
        try {
            return await FeedbackController.getMyRequests(user.uid);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Feedback'], summary: '[Student] ดูคำขอ Feedback ทั้งหมดของตัวเอง' }
    });

// ── [Verifier] Routes ──────────────────────────────────────
const verifierRoutes = new Elysia({ prefix: '/api/feedback' })
    .use(isVerifierMiddleware)

    .get('/pending', async ({ set }) => {
        try {
            return await FeedbackController.getPending();
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Feedback'], summary: '[Verifier] ดูคำขอ Feedback ที่รอการยืนยัน' }
    })

    .post('/:feedback_id/approve', async ({ params, body, user, set }) => {
        try {
            const result = await FeedbackController.approve(
                params.feedback_id, user.uid, getName(user),
                body.comment ?? '', body.criteria ?? []
            );
            if (result.code === 404) set.status = 404;
            if (result.code === 400) set.status = 400;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            comment:  t.Optional(t.String({ description: 'ความคิดเห็นจากอาจารย์' })),
            criteria: t.Optional(t.Array(CriteriaSchema, { description: 'เกณฑ์การประเมิน' })),
        }),
        detail: { tags: ['Feedback'], summary: '[Verifier] Approve คำขอ + evaluation + มอบ Badge อัตโนมัติ' }
    })

    .post('/:feedback_id/reject', async ({ params, body, user, set }) => {
        try {
            const result = await FeedbackController.reject(
                params.feedback_id, user.uid, getName(user),
                body.comment, body.criteria ?? []
            );
            if (result.code === 404) set.status = 404;
            if (result.code === 400) set.status = 400;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            comment:  t.String({ description: 'เหตุผลที่ปฏิเสธ / คำแนะนำ (จำเป็น)' }),
            criteria: t.Optional(t.Array(CriteriaSchema)),
        }),
        detail: { tags: ['Feedback'], summary: '[Verifier] Reject คำขอ + ให้ Feedback กลับนักศึกษา' }
    })

    .get('/my-reviews', async ({ user, set }) => {
        try {
            return await FeedbackController.getMyReviews(user.uid);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Feedback'], summary: '[Verifier] ดูประวัติที่ตัวเอง approve/reject ทั้งหมด' }
    });

// ── Export รวม ─────────────────────────────────────────────
export const feedbackRoute = new Elysia()
    .use(studentRoutes)
    .use(verifierRoutes);
