"use client";

import { useState } from 'react';
import { LandingPage } from './landing';
import { LoginPage } from './login';
import { SignUpPage } from './sign-up';

export default function Home() {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');

  const goToLogin = () => setView('login');
  const goToSignUp = () => setView('signup');
  const goToLanding = () => setView('landing');


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
        />
      )}
      {view === 'signup' && (
        <SignUpPage 
          onBackToLanding={goToLanding}
        />
      )}
 
    </main>
  );
}