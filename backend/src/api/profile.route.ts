// api/profile.route.ts
import { Elysia, t } from 'elysia';
import { isUserMiddleware, isVerifierMiddleware } from '../middleware/auth.middleware';
import { ProfileController } from '../controllers/profile.controller';

// ── Schema helpers ─────────────────────────────────────────
const PeriodSchema = t.Object({
    start: t.String(),
    end:   t.Optional(t.String()),
});

const ProjectSchema = t.Object({
    project_id:  t.Optional(t.String()),
    title:       t.String({ description: 'ชื่อโปรเจกต์' }),
    description: t.Optional(t.String()),
    skills_used: t.Optional(t.Array(t.String())),
    links: t.Optional(t.Object({
        github: t.Optional(t.String()),
        demo:   t.Optional(t.String()),
    })),
    image_url:   t.Optional(t.String()),
    created_at:  t.Optional(t.String()),
    updated_at:  t.Optional(t.String()),
    is_featured: t.Optional(t.Boolean()),
});

const ExperienceSchema = t.Object({
    company:     t.String(),
    role:        t.String(),
    description: t.Optional(t.String()),
    period:      PeriodSchema,
    is_current:  t.Optional(t.Boolean()),
});

const EducationSchema = t.Object({
    school:  t.String(),
    degree:  t.String(),
    field:   t.Optional(t.String()),
    period:  PeriodSchema,
});

// ── [Public] ──────────────────────────────────────────────
const publicRoutes = new Elysia({ prefix: '/api/profile' })

    .get('/:uid', async ({ params, set }) => {
        try {
            const result = await ProfileController.getPublicProfile(params.uid);
            if (result.code === 404) set.status = 404;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Profile'], summary: '[Public] ดู Profile ของ User / Verifier ใดก็ได้' }
    });

// ── [Student] ─────────────────────────────────────────────
const studentProfileRoutes = new Elysia({ prefix: '/api/profile' })
    .use(isUserMiddleware)

    .get('/me', async ({ user, set }) => {
        try {
            const result = await ProfileController.getStudentProfile(user.uid);
            if (result.code === 404) set.status = 404;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Profile'], summary: '[Student] ดู Profile ตัวเอง (ครบทุก field)' }
    })

    .put('/me', async ({ body, user, set }) => {
        try {
            const result = await ProfileController.updateStudentProfile(user.uid, body);
            if (result.code === 400) set.status = 400;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            name:       t.Optional(t.String()),
            bio:        t.Optional(t.String({ description: 'bio สั้น (แสดงใต้ชื่อ)' })),
            about_me:   t.Optional(t.String({ description: 'แนะนำตัวยาว (About Me section)' })),
            location:   t.Optional(t.String()),
            avatar_url: t.Optional(t.String()),
        }),
        detail: { tags: ['Profile'], summary: '[Student] แก้ไข Profile ตัวเอง' }
    })

    .put('/me/portfolio', async ({ body, user, set }) => {
        try {
            return await ProfileController.updatePortfolio(user.uid, body.projects);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            projects: t.Array(ProjectSchema, { description: 'Projects ทั้งหมด (overwrite)' }),
        }),
        detail: { tags: ['Profile'], summary: '[Student] อัปเดต Portfolio Projects' }
    })

    .put('/me/history/experience', async ({ body, user, set }) => {
        try {
            return await ProfileController.updateExperience(user.uid, body.experience);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            experience: t.Array(ExperienceSchema),
        }),
        detail: { tags: ['Profile'], summary: '[Student] อัปเดต Work Experience' }
    })

    .put('/me/history/education', async ({ body, user, set }) => {
        try {
            return await ProfileController.updateEducation(user.uid, body.education);
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            education: t.Array(EducationSchema),
        }),
        detail: { tags: ['Profile'], summary: '[Student] อัปเดต Education History' }
    });

// ── [Verifier] ────────────────────────────────────────────
const verifierProfileRoutes = new Elysia({ prefix: '/api/profile' })
    .use(isVerifierMiddleware)

    .get('/me', async ({ user, set }) => {
        try {
            const result = await ProfileController.getVerifierProfile(user.uid);
            if (result.code === 404) set.status = 404;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        detail: { tags: ['Profile'], summary: '[Verifier] ดู Profile อาจารย์ตัวเอง' }
    })

    .put('/me', async ({ body, user, set }) => {
        try {
            const result = await ProfileController.updateVerifierProfile(user.uid, body);
            if (result.code === 400) set.status = 400;
            return result;
        } catch (error) {
            set.status = 500;
            return { status: 'error', message: String(error) };
        }
    }, {
        body: t.Object({
            name:         t.Optional(t.String()),
            position:     t.Optional(t.String({ description: 'ตำแหน่ง เช่น Lecturer' })),
            organization: t.Optional(t.String()),
            avatar_url:   t.Optional(t.String()),
            location:     t.Optional(t.String()),
            expertise:    t.Optional(t.Array(t.String())),
        }),
        detail: { tags: ['Profile'], summary: '[Verifier] แก้ไข Profile อาจารย์' }
    });

// ── Export รวม ─────────────────────────────────────────────
export const profileRoute = new Elysia()
    .use(publicRoutes)
    .use(studentProfileRoutes)
    .use(verifierProfileRoutes);
