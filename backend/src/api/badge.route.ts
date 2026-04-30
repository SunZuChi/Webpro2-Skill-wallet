import { Elysia, t } from 'elysia';
import { BadgeController } from '../controllers/badge.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const badgeRoute = new Elysia({ prefix: '/api/badges' })
    // เรียกใช้ Middleware เพื่อให้แน่ใจว่าคนที่จะดึงข้อมูล Badge ต้อง Login แล้ว
    .get('/', async ({ headers, request, set }: any) => {
        const localAuthHeader = headers['authorization'] || request.headers.get('authorization');
        if (!localAuthHeader || !localAuthHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { status: "error", message: `Unauthorized. LocalHeader: ${localAuthHeader}` };
        }
        
        const idToken = localAuthHeader.split(' ')[1];
        try {
            const { auth } = await import('../config/firebase-admin');
            const decodedToken = await auth.verifyIdToken(idToken);
            // ถ้าผ่าน ให้ return ข้อมูล
            return await BadgeController.getAllBadges();
        } catch (error: any) {
            set.status = 401;
            return { status: "error", message: `Unauthorized. Token Error: ${error.message}` };
        }
    }, {
        detail: {
            tags: ['Badges'],
            summary: 'ดึงรายการ Badge ทั้งหมดที่เปิดใช้งานสำหรับแสดงใน Catalog'
        }
    })
    
    // GET /api/badges/:id - ดึงรายละเอียด Badge ตัวเดียวตาม ID
    .get('/:id', async ({ params, headers, request, set }: any) => {
        const localAuthHeader = headers['authorization'] || request.headers.get('authorization');
        if (!localAuthHeader || !localAuthHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { status: "error", message: "Unauthorized. Please login." };
        }
        try {
            const { auth } = await import('../config/firebase-admin');
            await auth.verifyIdToken(localAuthHeader.split(' ')[1]);
            return await BadgeController.getBadgeById(params.id);
        } catch (error: any) {
            set.status = 401;
            return { status: "error", message: `Unauthorized. Token Error: ${error.message}` };
        }
    }, {
        params: t.Object({ id: t.String() }),
        detail: {
            tags: ['Badges'],
            summary: 'ดึงรายละเอียดของ Badge ตาม ID ที่ระบุ'
        }
    });
