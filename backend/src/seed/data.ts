// seed/data.ts — ข้อมูลตัวอย่างทั้งหมดสำหรับ seed เข้า Firestore

// ── Badge Catalog — รายการ Badge ทั้งหมดที่นักศึกษาเลือก request ได้ ──────
export const badgeCatalog = [
    // ── SOFTWARE / WEB ─────────────────────────────────────
    {
        id: 'cat_html_basic',
        data: {
            badge_id:    'cat_html_basic',
            badge_name:  'Simple HTML Profile Page',
            skill:       'HTML',
            level:       'Beginner',
            category:    'SOFTWARE / WEB',
            description: 'สร้างหน้า Profile ด้วย HTML ล้วน โดยใช้ semantic tags ให้ถูกต้อง',
            issuer:      'KMUTT',
            icon:        '🌐',
            is_active:   true,
            evaluation_criteria: [
                { name: 'Basic HTML Tags Usage',     description: 'ใช้ tag พื้นฐานถูกต้อง เช่น h1, p, img, a' },
                { name: 'File Linking & Attributes', description: 'ลิงก์ CSS/Image ถูกต้อง, มี alt attribute' },
                { name: 'Code Formatting',           description: 'โค้ดสะอาด มี indentation ถูกต้อง' },
            ],
            created_at: '2026-01-01T00:00:00Z',
        },
    },
    {
        id: 'cat_react_basic',
        data: {
            badge_id:    'cat_react_basic',
            badge_name:  'React Developer',
            skill:       'React',
            level:       'Intermediate',
            category:    'SOFTWARE / WEB',
            description: 'สร้าง Web App ด้วย React รองรับ Component, State, Props',
            issuer:      'KMUTT',
            icon:        '⚛️',
            is_active:   true,
            evaluation_criteria: [
                { name: 'Component Structure',  description: 'แบ่ง component ได้อย่างเหมาะสม' },
                { name: 'State Management',     description: 'ใช้ useState / useEffect ได้ถูกต้อง' },
                { name: 'Props & Data Flow',    description: 'ส่ง props ระหว่าง component ได้' },
                { name: 'Code Quality',         description: 'โค้ดอ่านง่าย ไม่มี error' },
            ],
            created_at: '2026-01-01T00:00:00Z',
        },
    },
    {
        id: 'cat_nodejs_basic',
        data: {
            badge_id:    'cat_nodejs_basic',
            badge_name:  'Basic Backend (Node.js)',
            skill:       'Node.js',
            level:       'Beginner',
            category:    'SOFTWARE / WEB',
            description: 'สร้าง REST API ด้วย Node.js หรือ Bun',
            issuer:      'KMUTT',
            icon:        '🟢',
            is_active:   true,
            evaluation_criteria: [
                { name: 'REST API Design',    description: 'ออกแบบ endpoint ถูกต้องตาม REST convention' },
                { name: 'Middleware Usage',   description: 'ใช้ middleware ได้ เช่น auth, logging' },
                { name: 'Error Handling',     description: 'มีการ handle error และ return status ที่เหมาะสม' },
            ],
            created_at: '2026-01-01T00:00:00Z',
        },
    },
    // ── DATA / AI ──────────────────────────────────────────
    {
        id: 'cat_sql_basic',
        data: {
            badge_id:    'cat_sql_basic',
            badge_name:  'Basic SQL SELECT Queries',
            skill:       'SQL',
            level:       'Beginner',
            category:    'DATA / AI',
            description: 'เขียน SQL SELECT query ได้ รวมถึง WHERE, JOIN, GROUP BY',
            issuer:      'KMUTT',
            icon:        '🗄️',
            is_active:   true,
            evaluation_criteria: [
                { name: 'Basic SELECT',  description: 'SELECT, WHERE, ORDER BY ถูกต้อง' },
                { name: 'JOIN',          description: 'ใช้ INNER/LEFT JOIN ได้' },
                { name: 'Aggregation',   description: 'ใช้ COUNT, SUM, GROUP BY ได้' },
            ],
            created_at: '2026-01-01T00:00:00Z',
        },
    },
    // ── GAME / GRAPHICS ────────────────────────────────────
    {
        id: 'cat_figma_basic',
        data: {
            badge_id:    'cat_figma_basic',
            badge_name:  'Basic App Wireframe (Figma)',
            skill:       'Figma',
            level:       'Beginner',
            category:    'GAME / GRAPHICS',
            description: 'ออกแบบ Wireframe ของ Mobile/Web App ด้วย Figma',
            issuer:      'KMUTT',
            icon:        '🎨',
            is_active:   true,
            evaluation_criteria: [
                { name: 'Layout Structure',       description: 'จัดวาง layout ชัดเจน สมดุล' },
                { name: 'User Flow Logic',        description: 'การเชื่อมต่อหน้า (flow) สมเหตุสมผล' },
                { name: 'Component Consistency',  description: 'ใช้ component ซ้ำๆ ได้อย่างสม่ำเสมอ' },
            ],
            created_at: '2026-01-01T00:00:00Z',
        },
    },
    // ── CYBER / NETWORK ────────────────────────────────────
    {
        id: 'cat_network_basic',
        data: {
            badge_id:    'cat_network_basic',
            badge_name:  'Network Fundamentals',
            skill:       'Networking',
            level:       'Beginner',
            category:    'CYBER / NETWORK',
            description: 'เข้าใจ OSI Model, TCP/IP, และ basic network troubleshooting',
            issuer:      'KMUTT',
            icon:        '🔒',
            is_active:   true,
            evaluation_criteria: [
                { name: 'OSI / TCP-IP Model', description: 'อธิบาย layer และ protocol ได้ถูกต้อง' },
                { name: 'IP Addressing',      description: 'คำนวณ subnet และ CIDR ได้' },
                { name: 'Troubleshooting',    description: 'ใช้ ping, traceroute, nslookup ได้' },
            ],
            created_at: '2026-01-01T00:00:00Z',
        },
    },
];

// ── Types ─────────────────────────────────────────────────
interface Criteria  { name: string; score: number }
interface Badge {
    badge_id: string; badge_name: string; skill: string;
    level: string; issuer: string; status: string; issued_at: string;
    verification: {
        verifier_id: string; verifier_name: string;
        comment: string; verified_at: string;
        evaluation: { criteria: Criteria[] };
    };
}

// ── Verifier (อาจารย์) ────────────────────────────────────
export const verifiers = [
    {
        uid: 'v1',
        data: {
            auth: { user_id: 'v1', email: 'dr.smith@kmutt.ac.th', role: 'verifier' },
            profile: {
                name: 'Dr.Smith',
                email: 'dr.smith@kmutt.ac.th',
                position: 'Lecturer',
                organization: 'KMUTT',
                expertise: ['React', 'Node.js', 'AI'],
                avatar_url: '',
                location: 'Bangkok',
            },
            review_history: [],
        },
    },
    {
        uid: 'v2',
        data: {
            auth: { user_id: 'v2', email: 'prof.wittawin@kmutt.ac.th', role: 'verifier' },
            profile: {
                name: 'Prof. Wittawin',
                email: 'prof.wittawin@kmutt.ac.th',
                position: 'Associate Professor',
                organization: 'KMUTT',
                expertise: ['Figma', 'UX/UI', 'Game Design'],
                avatar_url: '',
                location: 'Bangkok',
            },
            review_history: [],
        },
    },
];

// ── Students (นักศึกษา) ───────────────────────────────────
export const students = [
    {
        uid: 'u1',
        data: {
            auth: { user_id: 'u1', email: 'yo@example.com', role: 'user' },
            profile: {
                name: 'Yosapart Raúl',
                email: 'yo@example.com',
                bio: 'Aspiring Full-Stack Developer & UI/UX Enthusiast',
                about_me: 'Senior Applied Computer Science student with a strong passion for building scalable web applications.',
                location: 'Bangkok, Thailand',
                avatar_url: '',
            },
            portfolio: {
                projects: [
                    {
                        project_id: 'p1',
                        title: 'Chat App',
                        description: 'Real-time chat with Firebase and React',
                        skills_used: ['React', 'Firebase', 'TypeScript'],
                        links: { github: 'https://github.com/yo/chat-app', demo: 'https://chatapp.com' },
                        image_url: '',
                        created_at: '2026-03-10',
                        updated_at: '2026-03-18',
                        is_featured: true,
                    },
                    {
                        project_id: 'p2',
                        title: 'Skill Wallet',
                        description: 'Digital credential wallet for students',
                        skills_used: ['Next.js', 'Elysia', 'Firestore'],
                        links: { github: 'https://github.com/yo/skill-wallet', demo: '' },
                        image_url: '',
                        created_at: '2026-04-01',
                        updated_at: '2026-04-20',
                        is_featured: true,
                    },
                ],
            },
            history: {
                experience: [
                    {
                        company: 'Google',
                        role: 'Frontend Developer Intern',
                        description: 'Worked on UI systems and component library',
                        period: { start: '2024-01', end: '2025-01' },
                        is_current: false,
                    },
                ],
                education: [
                    {
                        school: 'KMUTT',
                        degree: 'Bachelor of Science',
                        field: 'Computer Science',
                        period: { start: '2022', end: '2026' },
                    },
                ],
            },
            achievements: {
                badges: [
                    {
                        badge_id: 'b1',
                        badge_name: 'Basic App Wireframe (Figma)',
                        skill: 'Figma',
                        level: 'Beginner',
                        issuer: 'KMUTT',
                        status: 'approved',
                        issued_at: '2026-02-02T10:00:00Z',
                        verification: {
                            verifier_id: 'v2',
                            verifier_name: 'Prof. Wittawin',
                            comment: 'Great attention to detail on the user flows. The wireframes are clean, accessible, and demonstrate a solid understanding of UX principles.',
                            verified_at: '2026-02-02T10:00:00Z',
                            evaluation: {
                                criteria: [
                                    { name: 'Layout Structure', score: 1 },
                                    { name: 'User Flow Logic', score: 1 },
                                    { name: 'Component Consistency', score: 1 },
                                ],
                            },
                        },
                    } as Badge,
                    {
                        badge_id: 'b2',
                        badge_name: 'Basic Backend (Node.js)',
                        skill: 'Node.js',
                        level: 'Beginner',
                        issuer: 'KMUTT',
                        status: 'approved',
                        issued_at: '2026-03-15T10:00:00Z',
                        verification: {
                            verifier_id: 'v1',
                            verifier_name: 'Dr.Smith',
                            comment: 'Good understanding of REST API design and middleware.',
                            verified_at: '2026-03-15T10:00:00Z',
                            evaluation: {
                                criteria: [
                                    { name: 'REST API Design', score: 1 },
                                    { name: 'Middleware Usage', score: 1 },
                                    { name: 'Error Handling', score: 0 },
                                ],
                            },
                        },
                    } as Badge,
                ],
            },
        },
    },
    {
        uid: 'u2',
        data: {
            auth: { user_id: 'u2', email: 'manapot@example.com', role: 'user' },
            profile: {
                name: 'Manapot Sukawat',
                email: 'manapot@example.com',
                bio: 'Data Science Enthusiast',
                about_me: 'Passionate about machine learning and data visualization.',
                location: 'Bangkok, Thailand',
                avatar_url: '',
            },
            portfolio: { projects: [] },
            history: {
                experience: [],
                education: [
                    {
                        school: 'KMUTT',
                        degree: 'Bachelor of Science',
                        field: 'Data Science',
                        period: { start: '2023', end: '2027' },
                    },
                ],
            },
            achievements: { badges: [] },
        },
    },
    {
        uid: 'u3',
        data: {
            auth: { user_id: 'u3', email: 'suttinun@example.com', role: 'user' },
            profile: {
                name: 'Suttinun Rordorthai',
                email: 'suttinun@example.com',
                bio: 'Cybersecurity & Networking Focus',
                about_me: 'Interested in network security and ethical hacking.',
                location: 'Chiang Mai, Thailand',
                avatar_url: '',
            },
            portfolio: { projects: [] },
            history: { experience: [], education: [] },
            achievements: { badges: [] },
        },
    },
];

// ── Feedback requests (pending / approved / rejected) ──────
export const feedbacks = [
    // pending — รอการยืนยัน
    {
        id: 'fb_001',
        data: {
            feedback_id:      'fb_001',
            student_id:       'u1',
            student_name:     'Yosapart Raúl',
            badge_id:         'b3',
            badge_name:       'Simple HTML Profile Page',
            skill:            'HTML',
            level:            'Beginner',
            category:         'SOFTWARE / WEB',
            issuer:           'KMUTT',
            evidence_url:     'https://github.com/yo/first-html-page.zip',
            note:             'ผมทำหน้า profile ด้วย HTML ล้วนๆ ครับ ใช้ semantic tags ครบ',
            status:           'pending',
            verifier_id:      null,
            verifier_name:    null,
            verifier_comment: null,
            evaluation:       null,
            created_at:       '2026-04-26T01:00:00Z',
            updated_at:       '2026-04-26T01:00:00Z',
        },
    },
    {
        id: 'fb_002',
        data: {
            feedback_id:      'fb_002',
            student_id:       'u2',
            student_name:     'Manapot Sukawat',
            badge_id:         'b4',
            badge_name:       'Basic SQL SELECT Queries',
            skill:            'SQL',
            level:            'Beginner',
            category:         'DATA / AI',
            issuer:           'KMUTT',
            evidence_url:     '',
            note:             'แนบไฟล์ SQL queries ที่เขียนไว้ใน class',
            status:           'pending',
            verifier_id:      null,
            verifier_name:    null,
            verifier_comment: null,
            evaluation:       null,
            created_at:       '2026-04-25T08:00:00Z',
            updated_at:       '2026-04-25T08:00:00Z',
        },
    },
    // approved — ยืนยันแล้ว
    {
        id: 'fb_003',
        data: {
            feedback_id:      'fb_003',
            student_id:       'u1',
            student_name:     'Yosapart Raúl',
            badge_id:         'b1',
            badge_name:       'Basic App Wireframe (Figma)',
            skill:            'Figma',
            level:            'Beginner',
            category:         'GAME / GRAPHICS',
            issuer:           'KMUTT',
            evidence_url:     'https://figma.com/yo/wireframe-project',
            note:             '',
            status:           'approved',
            verifier_id:      'v2',
            verifier_name:    'Prof. Wittawin',
            verifier_comment: 'Great attention to detail on the user flows.',
            evaluation: {
                criteria: [
                    { name: 'Layout Structure',       score: 1 },
                    { name: 'User Flow Logic',        score: 1 },
                    { name: 'Component Consistency',  score: 1 },
                ],
            },
            created_at: '2026-01-20T09:00:00Z',
            updated_at: '2026-02-02T10:00:00Z',
        },
    },
];
