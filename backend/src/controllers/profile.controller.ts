// controllers/profile.controller.ts
import { db } from '../config/firebase-admin';

export const ProfileController = {

    // [Public] ดู Profile ของ user ใดก็ได้
    async getPublicProfile(uid: string) {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) return { status: 'error', message: 'ไม่พบผู้ใช้นี้', code: 404 };

        const data = userDoc.data()!;
        const role = data.auth?.role;

        return {
            status: 'success',
            uid,
            role,
            profile: data.profile ?? {},
            ...(role === 'user' && {
                achievements: data.achievements ?? { badges: [] },
                portfolio:    data.portfolio    ?? { projects: [] },
                history:      data.history      ?? { experience: [], education: [] },
            }),
            ...(role === 'verifier' && {
                expertise: data.profile?.expertise ?? [],
            }),
        };
    },

    // [Student] ดู Profile ตัวเอง (ครบทุก field)
    async getStudentProfile(uid: string) {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) return { status: 'error', message: 'ไม่พบข้อมูลผู้ใช้', code: 404 };

        const data = userDoc.data()!;
        return {
            status: 'success',
            uid,
            auth:         data.auth         ?? {},
            profile:      data.profile      ?? {},
            portfolio:    data.portfolio    ?? { projects: [] },
            history:      data.history      ?? { experience: [], education: [] },
            achievements: data.achievements ?? { badges: [] },
        };
    },

    // [Student] แก้ไข profile
    async updateStudentProfile(uid: string, body: {
        name?:       string;
        bio?:        string;
        about_me?:   string;
        location?:   string;
        avatar_url?: string;
    }) {
        const updateData: Record<string, any> = {};
        if (body.name       !== undefined) updateData['profile.name']       = body.name;
        if (body.bio        !== undefined) updateData['profile.bio']        = body.bio;
        if (body.about_me   !== undefined) updateData['profile.about_me']   = body.about_me;
        if (body.location   !== undefined) updateData['profile.location']   = body.location;
        if (body.avatar_url !== undefined) updateData['profile.avatar_url'] = body.avatar_url;

        if (Object.keys(updateData).length === 0) return { status: 'error', message: 'ไม่มีข้อมูลที่ต้องการแก้ไข', code: 400 };
        updateData['profile.updated_at'] = new Date().toISOString();

        await db.collection('users').doc(uid).update(updateData);
        return { status: 'success', message: 'อัปเดต Profile สำเร็จ' };
    },

    // [Student] อัปเดต Portfolio projects
    async updatePortfolio(uid: string, projects: any[]) {
        const normalized = projects.map((p: any, i: number) => ({
            project_id:  p.project_id  ?? `p_${Date.now()}_${i}`,
            title:       p.title,
            description: p.description ?? '',
            skills_used: p.skills_used ?? [],
            links:       p.links       ?? {},
            image_url:   p.image_url   ?? '',
            created_at:  p.created_at  ?? new Date().toISOString(),
            updated_at:  new Date().toISOString(),
            is_featured: p.is_featured ?? false,
        }));

        await db.collection('users').doc(uid).update({
            'portfolio.projects':   normalized,
            'portfolio.updated_at': new Date().toISOString(),
        });
        return { status: 'success', message: `อัปเดต Portfolio สำเร็จ (${normalized.length} projects)` };
    },

    // [Student] อัปเดต Work Experience
    async updateExperience(uid: string, experience: any[]) {
        await db.collection('users').doc(uid).update({
            'history.experience': experience,
            'history.updated_at': new Date().toISOString(),
        });
        return { status: 'success', message: `อัปเดต Experience สำเร็จ (${experience.length} รายการ)` };
    },

    // [Student] อัปเดต Education
    async updateEducation(uid: string, education: any[]) {
        await db.collection('users').doc(uid).update({
            'history.education':  education,
            'history.updated_at': new Date().toISOString(),
        });
        return { status: 'success', message: `อัปเดต Education สำเร็จ (${education.length} รายการ)` };
    },

    // [Verifier] ดู Profile อาจารย์ตัวเอง
    async getVerifierProfile(uid: string) {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) return { status: 'error', message: 'ไม่พบข้อมูลผู้ใช้', code: 404 };

        const data = userDoc.data()!;
        return {
            status: 'success',
            uid,
            auth:           data.auth           ?? {},
            profile:        data.profile        ?? {},
            review_history: data.review_history ?? [],
        };
    },

    // [Verifier] แก้ไข profile อาจารย์
    async updateVerifierProfile(uid: string, body: {
        name?:         string;
        position?:     string;
        organization?: string;
        avatar_url?:   string;
        location?:     string;
        expertise?:    string[];
    }) {
        const updateData: Record<string, any> = {};
        if (body.name         !== undefined) updateData['profile.name']         = body.name;
        if (body.position     !== undefined) updateData['profile.position']     = body.position;
        if (body.organization !== undefined) updateData['profile.organization'] = body.organization;
        if (body.avatar_url   !== undefined) updateData['profile.avatar_url']   = body.avatar_url;
        if (body.location     !== undefined) updateData['profile.location']     = body.location;
        if (body.expertise    !== undefined) updateData['profile.expertise']    = body.expertise;

        if (Object.keys(updateData).length === 0) return { status: 'error', message: 'ไม่มีข้อมูลที่ต้องการแก้ไข', code: 400 };
        updateData['profile.updated_at'] = new Date().toISOString();

        await db.collection('users').doc(uid).update(updateData);
        return { status: 'success', message: 'อัปเดต Profile สำเร็จ' };
    },
};
