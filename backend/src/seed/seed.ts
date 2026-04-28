// seed/seed.ts — รันด้วย: bun src/seed/seed.ts
import { db } from '../config/firebase-admin';
import { verifiers, students, feedbacks, badgeCatalog } from './data';

async function seed() {
    console.log('🌱 เริ่ม Seed ข้อมูลเข้า Firestore...\n');

    // ── Verifiers ──────────────────────────────────────────
    console.log('👨‍🏫 Seeding Verifiers...');
    for (const v of verifiers) {
        await db.collection('users').doc(v.uid).set(v.data);
        console.log(`  ✅ ${v.uid} — ${v.data.profile.name}`);
    }

    // ── Students ───────────────────────────────────────────
    console.log('\n🎓 Seeding Students...');
    for (const s of students) {
        await db.collection('users').doc(s.uid).set(s.data);
        const badgeCount = (s.data.achievements as any).badges.length;
        console.log(`  ✅ ${s.uid} — ${s.data.profile.name} (${badgeCount} badges)`);
    }

    // ── Feedbacks ──────────────────────────────────────────
    console.log('\n📋 Seeding Feedbacks...');
    for (const f of feedbacks) {
        await db.collection('feedbacks').doc(f.id).set(f.data);
        console.log(`  ✅ ${f.id} — ${f.data.badge_name} [${f.data.status}]`);
    }

    // ── Badge Catalog ───────────────────────────────────────
    console.log('\n🏅 Seeding Badge Catalog...');
    for (const b of badgeCatalog) {
        await db.collection('badge_catalog').doc(b.id).set(b.data);
        console.log(`  ✅ ${b.id} — ${b.data.badge_name} [${b.data.category}]`);
    }

    console.log('\n🎉 Seed เสร็จแล้ว! ตอนนี้มีข้อมูลใน Firestore แล้วครับ');
    console.log('   🔗 ทดสอบที่ http://localhost:3001/swagger');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed ล้มเหลว:', err);
    process.exit(1);
});
