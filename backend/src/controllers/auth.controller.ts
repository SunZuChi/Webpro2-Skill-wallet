// backend/src/controllers/auth.controller.ts
import { auth, db } from "../config/firebase-admin";

export const AuthController = {
    // ใช้สำหรับนักศึกษาที่ Register เอง
    async registerStudent(user_id: string, email: string, name: string) {
        await db.collection("users").doc(user_id).set({
            auth: { user_id, email, role: "user" },
            profile: { name, email, location: "Bangkok", bio: "" },
            portfolio: { projects: [] },
            achievements: { badges: [] }
        });
        return { status: "success", message: "Student registered" };
    },

    // ใช้สำหรับคุณ (Admin) สร้างให้อาจารย์เท่านั้น
    async createVerifier(user_id: string, email: string, name: string, position: string) {
        await db.collection("users").doc(user_id).set({
            auth: { user_id, email, role: "verifier" },
            profile: { 
                name, 
                email, 
                position, // เช่น "Lecturer"
                organization: "KMUTT",
                expertise: [] 
            },
            review_history: [] // อาจารย์ไม่มี Portfolio แต่มีประวัติการตรวจ
        });
        return { status: "success", message: "Verifier account created by Admin" };
    },
    // ระบบ Login (รองรับทั้ง Mock และ Token จริง)
    async loginCheck(idToken: string) {
        try {
            let user_id = "";

            // เช็คว่าเป็น Mock Login หรือไม่ (test-u1, test-u2)
            if (idToken.startsWith("test-")) {
                user_id = idToken.replace("test-", "");
            } else {
                // ถ้าไม่ใช่ Mock ให้เช็ค Token จริงกับ Firebase
                const decodedToken = await auth.verifyIdToken(idToken);
                user_id = decodedToken.uid;
            }

            // ไปดึงข้อมูลจาก DB จริงๆ ตาม UID ที่ได้
            const userDoc = await db.collection("users").doc(user_id).get();

            if (!userDoc.exists) {
                return { status: "error", message: "User not found in Firestore" };
            }

            const userData = userDoc.data();
            return {
                status: "success",
                role: userData?.auth?.role,
                data: userData
            };
        } catch (error) {
            return { status: "error", message: "Authentication Failed" };
        }
    }
};