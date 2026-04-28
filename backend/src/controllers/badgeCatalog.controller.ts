// controllers/badgeCatalog.controller.ts
import { db } from '../config/firebase-admin';

export const BadgeCatalogController = {

    // [Public] ดู Badge Catalog ทั้งหมด (filter ตาม category ได้)
    async getAll(category?: string) {
        let query = db.collection('badge_catalog')
            .where('is_active', '==', true) as FirebaseFirestore.Query;

        if (category && category !== 'all') {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        const badges = snapshot.docs.map(d => d.data());

        return { status: 'success', count: badges.length, badges };
    },

    // [Public] ดู Badge ตัวเดียวจาก catalog (เพื่อ pre-fill form)
    async getById(badge_id: string) {
        const doc = await db.collection('badge_catalog').doc(badge_id).get();
        if (!doc.exists) return { status: 'error', message: 'ไม่พบ Badge นี้ใน catalog', code: 404 };

        return { status: 'success', badge: doc.data() };
    },

    // [Admin] เพิ่ม Badge เข้า catalog
    async create(body: {
        badge_id:            string;
        badge_name:          string;
        skill:               string;
        level:               string;
        category:            string;
        description:         string;
        issuer?:             string;
        icon?:               string;
        evaluation_criteria: { name: string; description: string }[];
    }) {
        const existing = await db.collection('badge_catalog').doc(body.badge_id).get();
        if (existing.exists) return { status: 'error', message: `badge_id "${body.badge_id}" มีอยู่แล้ว`, code: 409 };

        const data = {
            ...body,
            issuer:     body.issuer ?? 'KMUTT',
            icon:       body.icon   ?? '🏅',
            is_active:  true,
            created_at: new Date().toISOString(),
        };

        await db.collection('badge_catalog').doc(body.badge_id).set(data);
        return { status: 'success', message: `เพิ่ม Badge "${body.badge_name}" เข้า catalog แล้ว`, badge: data };
    },

    // [Admin] ปิด Badge ออกจาก catalog (soft delete)
    async deactivate(badge_id: string) {
        const doc = await db.collection('badge_catalog').doc(badge_id).get();
        if (!doc.exists) return { status: 'error', message: 'ไม่พบ Badge นี้ใน catalog', code: 404 };

        await db.collection('badge_catalog').doc(badge_id).update({ is_active: false });
        return { status: 'success', message: `ปิด Badge "${badge_id}" ออกจาก catalog แล้ว` };
    },
};
