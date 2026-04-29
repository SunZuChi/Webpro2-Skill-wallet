// seed/data.ts — ข้อมูลเหรียญรางวัล (Badge Catalog)

export const badgeCatalog = [
    // ==========================================
    // ── SOFTWARE / WEB (5 Badges) ─────────────
    // ==========================================
    {
        id: 'cat_html_basic',
        data: {
            badge_id: 'cat_html_basic', badge_name: 'HTML Fundamentals', skill: 'HTML', level: 'Beginner', category: 'SOFTWARE / WEB',
            description: 'สร้างหน้าเว็บด้วย HTML ล้วน ใช้ semantic tags อย่างถูกต้อง', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', is_active: true,
            criteria_template: [
                { name: 'Semantic Tags', max_score: 1 },
                { name: 'Accessibility', max_score: 1 },
                { name: 'Document Structure', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_css_basic',
        data: {
            badge_id: 'cat_css_basic', badge_name: 'CSS Styling & Layout', skill: 'CSS', level: 'Beginner', category: 'SOFTWARE / WEB',
            description: 'ตกแต่งเว็บไซต์ด้วย CSS รองรับ Flexbox และ Grid', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', is_active: true,
            criteria_template: [
                { name: 'Responsive Design', max_score: 1 },
                { name: 'Modern Layouts', max_score: 1 },
                { name: 'Styling Accuracy', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_js_basic',
        data: {
            badge_id: 'cat_js_basic', badge_name: 'JavaScript Core', skill: 'JavaScript', level: 'Intermediate', category: 'SOFTWARE / WEB',
            description: 'เขียนลอจิกด้วย JS เข้าใจ DOM manipulation และ ES6+', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', is_active: true,
            criteria_template: [
                { name: 'ES6 Features', max_score: 1 },
                { name: 'DOM Manipulation', max_score: 1 },
                { name: 'Async Programming', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_react_basic',
        data: {
            badge_id: 'cat_react_basic', badge_name: 'React Developer', skill: 'React', level: 'Intermediate', category: 'SOFTWARE / WEB',
            description: 'สร้าง Web App ด้วย React จัดการ State และ Component', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', is_active: true,
            criteria_template: [
                { name: 'Hooks Usage', max_score: 1 },
                { name: 'Component Design', max_score: 1 },
                { name: 'Props Handling', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_nodejs_basic',
        data: {
            badge_id: 'cat_nodejs_basic', badge_name: 'Node.js Backend', skill: 'Node.js', level: 'Intermediate', category: 'SOFTWARE / WEB',
            description: 'สร้าง REST API เบื้องต้นด้วย Node.js/Express', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', is_active: true,
            criteria_template: [
                { name: 'API Design', max_score: 1 },
                { name: 'Error Handling', max_score: 1 },
                { name: 'Middleware', max_score: 1 }
            ]
        },
    },

    // ==========================================
    // ── DATA / AI (5 Badges) ──────────────────
    // ==========================================
    {
        id: 'cat_sql_basic',
        data: {
            badge_id: 'cat_sql_basic', badge_name: 'SQL Fundamentals', skill: 'SQL', level: 'Beginner', category: 'DATA / AI',
            description: 'เขียนคำสั่ง SELECT, WHERE, JOIN ขั้นพื้นฐาน', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', is_active: true,
            criteria_template: [
                { name: 'Basic Queries', max_score: 1 },
                { name: 'Joins', max_score: 1 },
                { name: 'Data Aggregation', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_python_data',
        data: {
            badge_id: 'cat_python_data', badge_name: 'Python for Data', skill: 'Python', level: 'Beginner', category: 'DATA / AI',
            description: 'ใช้ Python เขียนสคริปต์จัดการข้อมูลเบื้องต้น', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', is_active: true,
            criteria_template: [
                { name: 'Data Structures', max_score: 1 },
                { name: 'Basic Scripts', max_score: 1 },
                { name: 'File Handling', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_pandas_pro',
        data: {
            badge_id: 'cat_pandas_pro', badge_name: 'Data Wrangling', skill: 'Pandas', level: 'Intermediate', category: 'DATA / AI',
            description: 'ทำความสะอาดและวิเคราะห์ข้อมูลด้วย Pandas', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg', is_active: true,
            criteria_template: [
                { name: 'Data Cleaning', max_score: 1 },
                { name: 'Aggregation', max_score: 1 },
                { name: 'Data Merging', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_ml_intro',
        data: {
            badge_id: 'cat_ml_intro', badge_name: 'Machine Learning Basics', skill: 'ML', level: 'Intermediate', category: 'DATA / AI',
            description: 'สร้างโมเดลทำนายพื้นฐาน', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg', is_active: true,
            criteria_template: [
                { name: 'Model Training', max_score: 1 },
                { name: 'Evaluation', max_score: 1 },
                { name: 'Algorithm Selection', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_data_viz',
        data: {
            badge_id: 'cat_data_viz', badge_name: 'Data Visualization', skill: 'Tableau/PowerBI', level: 'Intermediate', category: 'DATA / AI',
            description: 'สร้าง Dashboard สื่อสารข้อมูลได้ตรงจุด', issuer: 'KMUTT', 
            icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Power_BI_Logo.svg', is_active: true,
            criteria_template: [
                { name: 'Chart Selection', max_score: 1 },
                { name: 'Storytelling', max_score: 1 },
                { name: 'Interactivity', max_score: 1 }
            ]
        },
    },

    // ==========================================
    // ── GAME / GRAPHICS (5 Badges) ────────────
    // ==========================================
    {
        id: 'cat_figma_basic',
        data: {
            badge_id: 'cat_figma_basic', badge_name: 'App Wireframe', skill: 'Figma', level: 'Beginner', category: 'GAME / GRAPHICS',
            description: 'ออกแบบ Wireframe จัด Layout เบื้องต้น', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', is_active: true,
            criteria_template: [
                { name: 'Layout Structure', max_score: 1 },
                { name: 'User Flow', max_score: 1 },
                { name: 'Component Reusability', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_unity_basic',
        data: {
            badge_id: 'cat_unity_basic', badge_name: 'Unity 3D Intro', skill: 'Unity', level: 'Beginner', category: 'GAME / GRAPHICS',
            description: 'สร้างฉากและเขียนสคริปต์ควบคุมตัวละครเบื้องต้น', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg', is_active: true,
            criteria_template: [
                { name: 'Scene Setup', max_score: 1 },
                { name: 'C# Scripting', max_score: 1 },
                { name: 'Physics Engine', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_blender_3d',
        data: {
            badge_id: 'cat_blender_3d', badge_name: '3D Modeling', skill: 'Blender', level: 'Beginner', category: 'GAME / GRAPHICS',
            description: 'ปั้นโมเดล 3 มิติ และกาง UV Mapping', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original.svg', is_active: true,
            criteria_template: [
                { name: 'Modeling', max_score: 1 },
                { name: 'Texturing', max_score: 1 },
                { name: 'UV Mapping', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_illustrator',
        data: {
            badge_id: 'cat_illustrator', badge_name: 'Vector Graphics', skill: 'Illustrator', level: 'Beginner', category: 'GAME / GRAPHICS',
            description: 'ออกแบบไอคอนและ Logo ด้วยเวกเตอร์', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg', is_active: true,
            criteria_template: [
                { name: 'Pen Tool', max_score: 1 },
                { name: 'Composition', max_score: 1 },
                { name: 'Pathfinder', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_video_edit',
        data: {
            badge_id: 'cat_video_edit', badge_name: 'Video Editing Pro', skill: 'Premiere Pro', level: 'Intermediate', category: 'GAME / GRAPHICS',
            description: 'ตัดต่อวิดีโอ ใส่เสียงและ Transitions', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/premierepro/premierepro-plain.svg', is_active: true,
            criteria_template: [
                { name: 'Cutting & Pace', max_score: 1 },
                { name: 'Audio Mixing', max_score: 1 },
                { name: 'Color Correction', max_score: 1 }
            ]
        },
    },

    // ==========================================
    // ── CYBER / NETWORK (5 Badges) ────────────
    // ==========================================
    {
        id: 'cat_net_basic',
        data: {
            badge_id: 'cat_net_basic', badge_name: 'Network Security', skill: 'Networking', level: 'Beginner', category: 'CYBER / NETWORK',
            description: 'เข้าใจ OSI Model, TCP/IP และการตั้งค่า IP', issuer: 'KMUTT', 
            icon: 'https://cdn-icons-png.flaticon.com/512/2885/2885417.png', is_active: true,
            criteria_template: [
                { name: 'OSI Model', max_score: 1 },
                { name: 'IP Subnetting', max_score: 1 },
                { name: 'Troubleshooting', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_linux_admin',
        data: {
            badge_id: 'cat_linux_admin', badge_name: 'Linux Server Admin', skill: 'Linux', level: 'Intermediate', category: 'CYBER / NETWORK',
            description: 'จัดการ Server ผ่าน Command Line (Bash)', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', is_active: true,
            criteria_template: [
                { name: 'File Permissions', max_score: 1 },
                { name: 'Service Management', max_score: 1 },
                { name: 'User Management', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_wireshark',
        data: {
            badge_id: 'cat_wireshark', badge_name: 'Packet Analysis', skill: 'Wireshark', level: 'Intermediate', category: 'CYBER / NETWORK',
            description: 'ดักจับและวิเคราะห์ Traffic เครือข่าย', issuer: 'KMUTT', 
            icon: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Wireshark_icon.svg', is_active: true,
            criteria_template: [
                { name: 'Traffic Capture', max_score: 1 },
                { name: 'Protocol Analysis', max_score: 1 },
                { name: 'Filtering', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_ethical_hack',
        data: {
            badge_id: 'cat_ethical_hack', badge_name: 'Ethical Hacking 101', skill: 'Security', level: 'Beginner', category: 'CYBER / NETWORK',
            description: 'เรียนรู้ช่องโหว่พื้นฐานและวิธีป้องกันเบื้องต้น', issuer: 'KMUTT', 
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kalilinux/kalilinux-original.svg', is_active: true,
            criteria_template: [
                { name: 'Reconnaissance', max_score: 1 },
                { name: 'Vulnerability Assessment', max_score: 1 },
                { name: 'Exploit Basics', max_score: 1 }
            ]
        },
    },
    {
        id: 'cat_crypto_basic',
        data: {
            badge_id: 'cat_crypto_basic', badge_name: 'Cryptography Basics', skill: 'Cryptography', level: 'Intermediate', category: 'CYBER / NETWORK',
            description: 'เข้าใจการเข้ารหัสข้อมูล (Symmetric/Asymmetric)', issuer: 'KMUTT', 
            icon: 'https://cdn-icons-png.flaticon.com/512/1655/1655160.png', is_active: true,
            criteria_template: [
                { name: 'Hashing', max_score: 1 },
                { name: 'Encryption Logic', max_score: 1 },
                { name: 'Key Management', max_score: 1 }
            ]
        },
    },
];
