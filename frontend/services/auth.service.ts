import { signInWithPopup, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export const AuthService = {
  // ล็อกอินด้วย Google (Frontend)
  async loginWithGoogle() {
    try {
      // ตั้งค่าให้ไม่จำบัญชีเมื่อปิดเบราว์เซอร์
      await setPersistence(auth, browserSessionPersistence);

      const result = await signInWithPopup(auth, googleProvider);
      // ได้ Token มา
      const idToken = await result.user.getIdToken();

      // ส่ง Token ไปตรวจสอบกับ Backend
      const response = await fetch("http://localhost:3001/api/auth/login-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.status === "not_registered") {
        // ถ้าล็อกอินใน Firebase สำเร็จ แต่ยังไม่ได้สมัคร (ลง Firestore)
        return { success: false, requireRegistration: true, idToken, name: result.user.displayName };
      }

      if (data.status === "success") {
        // เก็บ Token ไว้ใน localStorage เผื่อหน้าอื่นใช้ (หรือใช้ cookie ก็ได้)
        localStorage.setItem("token", idToken);
        localStorage.setItem("userRole", data.role);
        return { success: true, role: data.role, user: data.data };
      }

      throw new Error(data.message || "Login failed");
    } catch (error: any) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  // สมัครนักศึกษาใหม่ (ลง Firestore)
  async registerStudent(idToken: string, name: string) {
    const response = await fetch("http://localhost:3001/api/auth/register/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name, avatar_url: DEFAULT_AVATAR }),
    });
    const data = await response.json();
    return data;
  },

  // ออกจากระบบ
  async logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      await auth.signOut();
    } catch (error) {
      console.error("Logout error in AuthService:", error);
      throw error;
    }
  }
};
