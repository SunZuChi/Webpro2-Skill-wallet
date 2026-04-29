// api/badge.route.ts
import { Elysia, t } from 'elysia';
import { BadgeController } from '../controllers/badge.controller';

// Schema
const CriteriaSchema = t.Object({
    name:  t.String({ description: 'เกณฑ์ เช่น "Basic HTML Tags Usage"' }),
    score: t.Number({ description: '0 = ไม่ผ่าน, 1 = ผ่าน', minimum: 0, maximum: 1 }),
});

export const badgeRoute = new Elysia({ prefix: '/api/badge' })

    // (Admin) ยัด Badge ให้ User โดยตรง
    .post('/admin/grant', async ({ body, set }) => {
        try {
            return await BadgeController.grant(body);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            user_id:    t.String({ description: 'UID ของ user' }),
            badge_id:   t.String({ description: 'รหัส badge เช่น b1' }),
            badge_name: t.String({ description: 'ชื่อ badge เช่น React Developer' }),
            skill:      t.String({ description: 'ทักษะหลัก เช่น React' }),
            level:      t.String({ description: 'Beginner / Intermediate / Advanced' }),
            issuer:     t.Optional(t.String({ description: 'ผู้ออก Badge เช่น KMUTT' })),
            comment:    t.Optional(t.String()),
            criteria:   t.Optional(t.Array(CriteriaSchema)),
        }),
        detail: { tags: ['Badge'], summary: '(Admin) ยัด Badge ให้ User โดยตรง' }
    })

    // (Admin) ถอด Badge ออกจาก User
    .delete('/admin/revoke', async ({ body, set }) => {
        try {
            const result = await BadgeController.revoke(body.user_id, body.badge_id);
            if (result.code === 404) { set.status = 404; }
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            user_id:  t.String(),
            badge_id: t.String(),
        }),
        detail: { tags: ['Badge'], summary: '(Admin) ถอด Badge จาก User' }
    })

    // (Public) ดู Badges ของ User
    .get('/user/:uid', async ({ params, set }) => {
        try {
            const result = await BadgeController.getUserBadges(params.uid);
            if (result.code === 404) { set.status = 404; }
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Badge'], summary: 'ดู Badges ทั้งหมดของ User' }
    });
