// api/verifier.route.ts
import { Elysia, t } from 'elysia';
import { isVerifierMiddleware } from '../middleware/auth.middleware';
import { VerifierController } from '../controllers/verifier.controller';

// ============================================================
// Verifier Route — เฉพาะ role: verifier เท่านั้น
//
// Feedback Management:
//   GET  /api/verifier/feedbacks              — ดู feedbacks ทั้งหมด (filter by status)
//   GET  /api/verifier/feedbacks/:feedback_id — ดูรายละเอียด feedback + student evidence
//
// Student Directory:
//   GET  /api/verifier/students               — รายชื่อนักศึกษาทั้งหมด (search + filter)
//   GET  /api/verifier/students/:uid          — ดู profile นักศึกษาแบบ verifier view
// ============================================================

export const verifierRoute = new Elysia({ prefix: '/api/verifier' })
    .use(isVerifierMiddleware)

    // ── Feedback Management ─────────────────────────────────

    // GET /api/verifier/feedbacks?status=all|pending|approved|rejected
    .get('/feedbacks', async ({ query, set }) => {
        try {
            const status = (query as any).status ?? 'all';
            return await VerifierController.getFeedbacks(status);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        query: t.Object({
            status: t.Optional(t.Union([
                t.Literal('all'),
                t.Literal('pending'),
                t.Literal('approved'),
                t.Literal('rejected'),
            ], { description: 'Filter ตาม status (default: all)' })),
        }),
        detail: { tags: ['Verifier'], summary: '[Verifier] ดู Feedback requests ทั้งหมด (filter by status)' }
    })

    // GET /api/verifier/feedbacks/:feedback_id — รายละเอียด feedback + student evidence + criteria
    .get('/feedbacks/:feedback_id', async ({ params, set }) => {
        try {
            const result = await VerifierController.getFeedbackById(params.feedback_id);
            if (result.code === 404) set.status = 404;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Verifier'], summary: '[Verifier] ดูรายละเอียด Feedback request (student evidence + criteria)' }
    })

    // ── Student Directory ───────────────────────────────────

    // GET /api/verifier/students?search=...&category=...
    .get('/students', async ({ query, set }) => {
        try {
            const { search, category } = query as any;
            return await VerifierController.getStudents(search, category);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        query: t.Object({
            search:   t.Optional(t.String({ description: 'ค้นหาด้วยชื่อ หรือ UID' })),
            category: t.Optional(t.String({ description: 'Filter ตาม primary skill เช่น React, AI (all = ทั้งหมด)' })),
        }),
        detail: { tags: ['Verifier'], summary: '[Verifier] รายชื่อนักศึกษาทั้งหมด (ค้นหา + filter skill ได้)' }
    })

    // GET /api/verifier/students/:uid — Verifier view ของนักศึกษาคนนึง
    .get('/students/:uid', async ({ params, set }) => {
        try {
            const result = await VerifierController.getStudentDetail(params.uid);
            if (result.code === 404) set.status = 404;
            if (result.code === 400) set.status = 400;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Verifier'], summary: '[Verifier] ดู Profile นักศึกษาแบบละเอียด (badges + skill matrix + feedback history)' }
    });
