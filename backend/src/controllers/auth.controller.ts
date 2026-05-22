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
                headline: "",
                bio: "",
                location: "Bangkok",
                avatar_url: ""
            },
            experience: [],
            education: []
        });
        return { status: "success", message: "Student registered" };
    },

    // ใช้สำหรับคุณ (Admin) สร้างให้อาจารย์เท่านั้น
    async createVerifier(user_id: string, email: string, name: string, position: string, password?: string) {
        await db.collection("users").doc(user_id).set({
            user_id: user_id,
            email: email,
            password: password || "123456", // ถ้าไม่ใส่รหัสมา จะตั้งค่าเริ่มต้นให้
            role: "verifier",
            profile: {
                name: name,
                position: position,
                organization: "KMUTT",
                expertise: [],
                avatar_url: ""
            }
        });
        return { status: "success", message: "Verifier account created with password" };
    },

    // ระบบ Login ของอาจารย์โดยใช้ Email และ Password
    async loginVerifier(email: string, password: string) {
        try {
            // ค้นหาในฐานข้อมูลด้วย email
            const snapshot = await db.collection("users")
                .where("email", "==", email)
                .where("role", "==", "verifier")
                .limit(1)
                .get();

            if (snapshot.empty) {
                return { status: "error", message: "Email not found or not a Verifier account" };
            }

            const userData = snapshot.docs[0].data();
            const user_id = snapshot.docs[0].id;

            if (userData?.password !== password) {
                return { status: "error", message: "Incorrect password" };
            }

            return {
                status: "success",
                role: "verifier",
                user_id: user_id,
                data: userData
            };
        } catch (error) {
            return { status: "error", message: "Login failed" };
        }
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
                role: userData?.role,
                data: userData
            };
        } catch (error) {
            console.error("Firebase verifyIdToken error:", error);
            return { status: "error", message: "Authentication Failed" };
        }
    }
};