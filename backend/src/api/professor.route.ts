import { Elysia } from 'elysia';
import { ProfessorController } from '../controllers/professor.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const professorRoute = new Elysia({ prefix: '/professor' })
    .use(authMiddleware)
    // GET /api/professor/badge-requests — ดึงคำขอทั้งหมด (สำหรับ Professor เท่านั้น)
    .get('/badge-requests', async ({ set }: any) => {
        try {
            return await ProfessorController.getAllRequests();
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        detail: { tags: ['Professor'], summary: 'ดึงคำขอ Badge ทั้งหมดสำหรับนำไปตรวจ (Professor เท่านั้น)' }
    });
