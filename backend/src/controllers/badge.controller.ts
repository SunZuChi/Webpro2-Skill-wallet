// controllers/badge.controller.ts
import { db } from '../config/firebase-admin';
import admin from 'firebase-admin';

const { FieldValue } = admin.firestore;

export const BadgeController = {

    // (Admin) ยัด Badge ให้ User โดยตรง
    async grant(body: {
        user_id:    string;
        badge_id:   string;
        badge_name: string;
        skill:      string;
        level:      string;
        issuer?:    string;
        comment?:   string;
        criteria?:  { name: string; score: number }[];
    }) {
        const badge = {
            badge_id:   body.badge_id,
            badge_name: body.badge_name,
            skill:      body.skill,
            level:      body.level,
            issuer:     body.issuer ?? 'KMUTT',
            status:     'approved',
            issued_at:  new Date().toISOString(),
            verification: {
                verifier_id:   'admin',
                verifier_name: 'Admin',
                comment:       body.comment ?? '',
                verified_at:   new Date().toISOString(),
                evaluation: { criteria: body.criteria ?? [] },
            },
        };

        await db.collection('users').doc(body.user_id).update({
            'achievements.badges': FieldValue.arrayUnion(badge),
        });

        return { status: 'success', message: `Badge "${body.badge_name}" granted to ${body.user_id}`, badge };
    },

    // (Admin) ถอด Badge ออกจาก User
    async revoke(user_id: string, badge_id: string) {
        const userDoc = await db.collection('users').doc(user_id).get();
        if (!userDoc.exists) {
            return { status: 'error', message: 'User not found', code: 404 };
        }

        const badges = userDoc.data()?.achievements?.badges ?? [];
        const updated = badges.filter((b: { badge_id: string }) => b.badge_id !== badge_id);

        await db.collection('users').doc(user_id).update({ 'achievements.badges': updated });
        return { status: 'success', message: `Badge "${badge_id}" removed from ${user_id}` };
    },

    // (Public) ดู Badges ของ User
    async getUserBadges(uid: string) {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return { status: 'error', message: 'User not found', code: 404 };
        }
        return { status: 'success', badges: userDoc.data()?.achievements?.badges ?? [] };
    },
};
