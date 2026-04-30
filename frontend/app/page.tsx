"use client";

import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LandingPage } from './landing/landing';
import { LoginPage } from './authen/login';
import { SignUpPage } from './authen/sign-up';
import { OverviewPage } from './user/overview/dash';
import MyBadgesPage from './user/badges/mybadge';

export default function Home() {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'overview'>('landing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // เช็คสถานะการ Login อัตโนมัติเมื่อเปิดหน้าเว็บ
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // ตรวจสอบและ Auto-route เฉพาะตอนเปิดเว็บครั้งแรก (loading เป็น true)
      // เพื่อไม่ให้ไปขัดจังหวะตอนกำลังกด Login ในหน้า login.tsx
      if (user && loading) {
        const token = localStorage.getItem("token");
        if (!token) {
          await auth.signOut();
        } else {
          setView('overview');
        }
      } else if (!user) {
        // ถ้ายังไม่ได้ Login หรือออกจากระบบ ให้ล้าง Token ด้วย
        localStorage.removeItem("token");
        setView((prev) => (prev === 'login' || prev === 'signup' ? prev : 'landing'));
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const goToLogin = () => setView('login');
  const goToSignUp = () => setView('signup');
  const goToLanding = () => setView('landing');
  const goToOverview = () => setView('overview');

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <main className="min-h-screen">
      {view === 'landing' && (
        <LandingPage 
          onLoginClick={goToLogin}
          onSignUpClick={goToSignUp} 
          onBackToLanding={goToLanding}
        />
      )}
      {view === 'login' && (
        <LoginPage 
          onBackToLanding={goToLanding}
          onLoginSuccess={goToOverview}
        />
      )}
      {view === 'signup' && (
        <SignUpPage 
          onBackToLanding={goToLanding}
        />
      )}
      {view === 'overview' && (
        <OverviewPage />
      )}
    </main>
  );
}