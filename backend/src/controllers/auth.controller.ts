// backend/src/controllers/auth.controller.ts
import { auth, db } from "../config/firebase-admin";

export const AuthController = {
    // ใช้สำหรับนักศึกษาที่ Register เอง
    async registerStudent(user_id: string, email: string, name: string) {
        await db.collection("users").doc(user_id).set({
            auth: { user_id, email, role: "user" },
            profile: {
                name,
                email,
                bio: "",
                about_me: "",
                location: "Bangkok",
                avatar_url: "",
            },
            portfolio: { projects: [] },
            history: {
                experience: [],
                education: [],
            },
            achievements: { badges: [] },
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
                position,        // เช่น "Lecturer"
                organization: "KMUTT",
                expertise:    [],
                avatar_url:   "",
                location:     "Bangkok",
            },
            review_history: [],  // ประวัติการ approve/reject
        });
        return { status: "success", message: "Verifier account created by Admin" };
    },
    // ระบบ Login (รองรับทั้ง Mock และ Token จริง)
    async loginCheck(idToken: string) {
        try {
            // ====== MOCK MODE ======
            // รูปแบบ: test-u<number> = นักศึกษา, test-v<number> = อาจารย์
            // เช่น test-u1, test-u2, test-v1, test-v2
            if (idToken.startsWith("test-")) {
                const mockId = idToken.replace("test-", ""); // เช่น "u1", "v1"
                
                let role: "user" | "verifier";
                if (mockId.startsWith("u")) {
                    role = "user";
                } else if (mockId.startsWith("v")) {
                    role = "verifier";
                } else {
                    return { status: "error", message: "Invalid mock token format. Use test-u<n> or test-v<n>" };
                }

                // ถ้ามี Firestore document ก็ดึงมาด้วย ถ้าไม่มีก็ return role อย่างเดียว
                const userDoc = await db.collection("users").doc(mockId).get();
                return {
                    status: "success",
                    role,
                    uid: mockId,
                    data: userDoc.exists ? userDoc.data() : { auth: { user_id: mockId, role } }
                };
            }

            // ====== REAL MODE ======
            // ตรวจสอบ idToken จริงกับ Firebase
            const decodedToken = await auth.verifyIdToken(idToken);
            const user_id = decodedToken.uid;

            // ดึงข้อมูลจาก Firestore
            const userDoc = await db.collection("users").doc(user_id).get();
            if (!userDoc.exists) {
                return { status: "error", message: "User not found in Firestore. Please register first." };
            }

            const userData = userDoc.data();
            return {
                status: "success",
                role: userData?.auth?.role,
                uid: user_id,
                data: userData
            };
        } catch (error) {
            return { status: "error", message: "Authentication Failed" };
        }
    }
};