// backend/src/controllers/auth.controller.ts
import { auth, db } from "../config/firebase-admin";

export const AuthController = {
    // ใช้สำหรับนักศึกษาที่ Register เอง
    async registerStudent(user_id: string, email: string, name: string) {
        await db.collection("users").doc(user_id).set({
            user_id: user_id,
            email: email,
            role: "user",
            profile: { 
                name: name,
                bio: "",
                about_me: "",
                location: "Bangkok",
                avatar_url: ""
            },
            experience: [],
            education: []
        });
        return { status: "success", message: "Student registered" };
    },

    // ใช้สำหรับคุณ (Admin) สร้างให้อาจารย์เท่านั้น
    async createVerifier(user_id: string, email: string, name: string, position: string) {
        await db.collection("users").doc(user_id).set({
            user_id: user_id,
            email: email,
            role: "verifier",
            profile: {
                name: name,
                position: position,
                organization: "KMUTT",
                expertise: [],
                avatar_url: ""
            },
            review_history: []
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
                return {
                    status: "not_registered",
                    message: "User not found in Firestore",
                    uid: user_id,
                };
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