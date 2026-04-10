import { Elysia, t } from 'elysia';
import { AuthController } from '../controllers/auth.controller';
// backend/src/routes/auth.route.ts
export const authRoute = new Elysia({ prefix: '/api/auth' })

    .post('/login-check', async ({ body }) => {
        return await AuthController.loginCheck(body.idToken);
    }, {
        body: t.Object({ idToken: t.String() }),
        detail: { tags: ['Auth'], summary: 'Login ด้วย Token หรือ test-uid' }
    })
    // เส้นนี้เปิดให้หน้าบ้าน (นักศึกษา) ใช้สมัคร
    .post('/register/student', async ({ body }) => {
        return await AuthController.registerStudent(body.user_id, body.email, body.name);
    }, {
        body: t.Object({ user_id: t.String(), email: t.String(), name: t.String() }),
        detail: { tags: ['Auth'], summary: 'สร้างบัญชีนักศึกษา' }
    })

    // เส้นนี้ "คุณ" เอาไว้ใช้สร้างบัญชีให้อาจารย์ผ่าน Swagger เท่านั้น (ไม่ต้องทำหน้าบ้าน)
    .post('/admin/create-verifier', async ({ body }) => {
        return await AuthController.createVerifier(body.user_id, body.email, body.name, body.position);
    }, {
        body: t.Object({
            user_id: t.String(),
            email: t.String(),
            name: t.String(),
            position: t.String()
        }),
        detail: { tags: ['Admin Only'], summary: 'สร้างบัญชีอาจารย์ (Verifier)' }
    });