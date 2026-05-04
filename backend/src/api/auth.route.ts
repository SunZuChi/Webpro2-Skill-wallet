import { Elysia, t } from 'elysia';
import { AuthController } from '../controllers/auth.controller';
import { auth, db } from '../config/firebase-admin';
import { authMiddleware } from '../middleware/auth.middleware';

// backend/src/routes/auth.route.ts
export const authRoute = new Elysia({ prefix: '/auth' })
    .use(authMiddleware)

    .post('/login-check', async ({ body }) => {
        return await AuthController.loginCheck(body.idToken);
    }, {
        body: t.Object({ idToken: t.String() }),
        detail: { tags: ['Auth'], summary: 'Login ด้วย Token หรือ test-uid' }
    })
    // เส้นนี้เปิดให้หน้าบ้าน (นักศึกษา) ใช้สมัคร
    .post('/register/student', async ({ body }) => {
        const decodedToken = await auth.verifyIdToken(body.idToken);
        return await AuthController.registerStudent(decodedToken.uid, decodedToken.email || "", body.name);
    }, {
        body: t.Object({ idToken: t.String(), name: t.String() }),
        detail: { tags: ['Auth'], summary: 'สร้างบัญชีนักศึกษา' }
    })

    // GET /api/auth/me — ดึงข้อมูล user profile ของผู้ที่ login อยู่
    .get('/me', async ({ user, set }: any) => {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists) {
                set.status = 404;
                return { status: 'error', message: 'User not found' };
            }
            return { status: 'success', data: { id: userDoc.id, ...userDoc.data() } };
        } catch (error: any) {
            set.status = 500;
            return { status: 'error', message: error.message };
        }
    }, {
        isSignIn: true,
        detail: { tags: ['Auth'], summary: 'ดึงข้อมูลผู้ใช้ที่ Login อยู่ปัจจุบัน' }
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