import { Elysia } from 'elysia';
import { auth } from '../config/firebase-admin';

// สร้าง Middleware สำหรับตรวจสอบ Token
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
    .derive(async ({ headers, request }) => {
        const authHeader = headers['authorization'] || request.headers.get('authorization');

        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            return { user: null as { uid: string; email?: string } | null, authError: `No Token. Received: ${authHeader}` };
        }

        const idToken = authHeader.split(' ')[1];

        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            return {
                user: { uid: decodedToken.uid, email: decodedToken.email },
                authError: null as string | null
            };
        } catch (error: any) {
            return { user: null as { uid: string; email?: string } | null, authError: error.message as string | null };
        }
    })
    // macro สำหรับ Elysia v1: guard route ที่ต้องการ login
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return {};
            return {
                beforeHandle({ user, authError, set }: any) {
                    if (!user) {
                        set.status = 401;
                        return { status: "error", message: `Unauthorized. Please login. Details: ${authError || "No Token"}` };
                    }
                }
            };
        }
    })
    .as('global');
