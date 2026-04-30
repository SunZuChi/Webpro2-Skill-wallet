import { Elysia, t } from 'elysia';
import { AuthController } from '../controllers/auth.controller';
import { auth, db } from '../config/firebase-admin';
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
        const decodedToken = await auth.verifyIdToken(body.idToken);
        return await AuthController.registerStudent(decodedToken.uid, decodedToken.email || "", body.name);
    }, {
        body: t.Object({ idToken: t.String(), name: t.String() }),
        detail: { tags: ['Auth'], summary: 'สร้างบัญชีนักศึกษา' }
    })

    // GET /api/auth/me — ดึงข้อมูล user profile ของผู้ที่ login อยู่
    .get('/me', async ({ headers, request, set }: any) => {
        const authHeader = headers['authorization'] || request?.headers?.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { status: 'error', message: 'Unauthorized' };
        }
        try {
            const idToken = authHeader.split(' ')[1];
            const decodedToken = await auth.verifyIdToken(idToken);
            const userDoc = await db.collection('users').doc(decodedToken.uid).get();
            if (!userDoc.exists) {
                set.status = 404;
                return { status: 'error', message: 'User not found' };
            }
            return { status: 'success', data: { id: userDoc.id, ...userDoc.data() } };
        } catch (error: any) {
            set.status = 401;
            return { status: 'error', message: 'Invalid token' };
        }
    }, {
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