// seed/seed.ts — รันด้วย: bun src/seed/seed.ts
import { db } from '../config/firebase-admin';
import { badgeCatalog } from './data';

async function seed() {
    console.log(' เริ่ม Seed ข้อมูลเข้า Firestore...\n');

    // ── Badge Catalog ───────────────────────────────────────
    console.log(' Seeding Badge Catalog...');
    let count = 0;
    for (const b of badgeCatalog) {
        await db.collection('badge_catalog').doc(b.id).set(b.data);
        console.log(`   ${b.id} — ${b.data.badge_name} [${b.data.category}]`);
        count++;
    }

    console.log(`\n Seed เสร็จแล้ว! เพิ่มเหรียญทั้งหมด ${count} เหรียญใน Firestore แล้วครับ`);
    console.log('    ทดสอบที่ http://localhost:3001/swagger');
    process.exit(0);
}

seed().catch((err) => {
    console.error(' Seed ล้มเหลว:', err);
    process.exit(1);
});
