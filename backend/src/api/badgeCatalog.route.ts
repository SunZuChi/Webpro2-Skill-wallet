// api/badgeCatalog.route.ts
import { Elysia, t } from 'elysia';
import { BadgeCatalogController } from '../controllers/badgeCatalog.controller';

// ============================================================
// Badge Catalog Route
//
// [Public]    GET  /api/catalog               — ดู badge ทั้งหมดที่มีในระบบ
// [Public]    GET  /api/catalog/:badge_id     — ดูรายละเอียด badge (pre-fill form)
// [Admin]     POST /api/catalog               — เพิ่ม badge ใหม่
// [Admin]     PUT  /api/catalog/:badge_id/deactivate — ปิด badge
// ============================================================

export const badgeCatalogRoute = new Elysia({ prefix: '/api/catalog' })

    // GET /api/catalog?category=SOFTWARE / WEB
    .get('/', async ({ query, set }) => {
        try {
            const category = (query as any).category;
            return await BadgeCatalogController.getAll(category);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        query: t.Object({
            category: t.Optional(t.String({
                description: 'Filter ตาม category เช่น "SOFTWARE / WEB", "DATA / AI", "GAME / GRAPHICS", "CYBER / NETWORK" (all = ทั้งหมด)'
            })),
        }),
        detail: { tags: ['Badge Catalog'], summary: '[Public] ดู Badge ทั้งหมดในระบบ (เลือก request ได้)' }
    })

    // GET /api/catalog/:badge_id — pre-fill ข้อมูลตอนนักศึกษากดเลือก badge
    .get('/:badge_id', async ({ params, set }) => {
        try {
            const result = await BadgeCatalogController.getById(params.badge_id);
            if (result.code === 404) set.status = 404;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Badge Catalog'], summary: '[Public] ดูรายละเอียด Badge + evaluation criteria (pre-fill form)' }
    })

    // POST /api/catalog — Admin เพิ่ม badge ใหม่
    .post('/', async ({ body, set }) => {
        try {
            const result = await BadgeCatalogController.create(body);
            if (result.code === 409) set.status = 409;
            else set.status = 201;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            badge_id:    t.String({ description: 'รหัส badge (unique) เช่น cat_react_advanced' }),
            badge_name:  t.String({ description: 'ชื่อ badge เช่น Advanced React Developer' }),
            skill:       t.String({ description: 'ทักษะหลัก เช่น React' }),
            level:       t.Union([
                t.Literal('Beginner'), t.Literal('Intermediate'), t.Literal('Advanced')
            ]),
            category:    t.String({ description: 'SOFTWARE / WEB | DATA / AI | GAME / GRAPHICS | CYBER / NETWORK' }),
            description: t.String({ description: 'คำอธิบาย badge' }),
            issuer:      t.Optional(t.String()),
            icon:        t.Optional(t.String({ description: 'Emoji เช่น ⚛️' })),
            evaluation_criteria: t.Array(
                t.Object({
                    name:        t.String({ description: 'ชื่อเกณฑ์' }),
                    description: t.String({ description: 'คำอธิบายเกณฑ์' }),
                }),
                { description: 'เกณฑ์ที่อาจารย์จะใช้ประเมิน' }
            ),
        }),
        detail: { tags: ['Admin Only'], summary: '(Admin) เพิ่ม Badge ใหม่เข้า Catalog' }
    })

    // PUT /api/catalog/:badge_id/deactivate — Admin ปิด badge
    .put('/:badge_id/deactivate', async ({ params, set }) => {
        try {
            const result = await BadgeCatalogController.deactivate(params.badge_id);
            if (result.code === 404) set.status = 404;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Admin Only'], summary: '(Admin) ปิด Badge ออกจาก Catalog (soft delete)' }
    });
