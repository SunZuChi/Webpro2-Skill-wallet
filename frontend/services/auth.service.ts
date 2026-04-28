import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const API_URL = 'http://localhost:3001/api/auth';
const googleProvider = new GoogleAuthProvider();

export const AuthService = {
  // ===== LOGIN (Email/Password) =====
  async login(email: string, password: string) {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch(`${API_URL}/login-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) throw new Error('Backend login check failed');
      return await response.json(); // { status, role, uid, data }

    } catch (error: unknown) {
      // แปลง Firebase Error Code ให้เป็นข้อความที่อ่านง่าย
      const code = (error as { code?: string })?.code;

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      if (code === 'auth/account-exists-with-different-credential' || code === 'auth/popup-blocked') {
        throw new Error('GOOGLE_ACCOUNT'); // signal ให้ลอง Google แทน
      }
      // กรณีที่บัญชีนี้ถูกสร้างผ่าน Google (ไม่มี password)
      // Firebase จะ throw auth/invalid-credential
      // เราลองดึง providers ของ email นี้แล้วบอก user
      if (code === 'auth/too-many-requests') {
        throw new Error('มีการพยายาม login บ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่');
      }

      // Re-throw error เดิมถ้าไม่ตรงกับ case ใดข้างบน
      throw error;
    }
  },

  // ===== LOGIN WITH GOOGLE =====
  // ถ้าเป็น User ใหม่ที่ยังไม่มีใน Firestore → สร้างให้อัตโนมัติ (role: user)
  async loginWithGoogle() {
    const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // ลองเช็คก่อนว่ามีอยู่ใน Firestore แล้วหรือยัง
    const checkResponse = await fetch(`${API_URL}/login-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const checkData = await checkResponse.json();

    // ถ้ายังไม่มีใน Firestore → สร้าง account ใหม่ให้เป็น student อัตโนมัติ
    if (checkData.status === 'error' && checkData.message?.includes('not found')) {
      const registerResponse = await fetch(`${API_URL}/register/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          email: user.email ?? '',
          name: user.displayName ?? user.email ?? 'Google User',
        }),
      });

      if (!registerResponse.ok) throw new Error('Failed to create user profile');

      // Login check อีกครั้งหลัง register
      const retryResponse = await fetch(`${API_URL}/login-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      return await retryResponse.json();
    }

    return checkData; // { status, role, uid, data }
  },

  // ===== REGISTER (Email/Password) =====
  async register(email: string, password: string, name: string) {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user_id = userCredential.user.uid;

    const response = await fetch(`${API_URL}/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, email, name }),
    });

    if (!response.ok) {
      await userCredential.user.delete();
      throw new Error('Failed to create user profile in database');
    }

    return await response.json(); // { status, message }
  },

  // ===== LOGOUT =====
  async logout() {
    await signOut(auth);
  },
};

