"use client";

import { useState } from 'react';
import { LandingPage } from './landing/landing';
import { LoginPage } from './authen/login';
import { SignUpPage } from './authen/sign-up';
import {OverviewPage} from './user/overview/dash';

export default function Home() {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'overview'>('landing');

  const goToLogin = () => setView('login');
  const goToSignUp = () => setView('signup');
  const goToLanding = () => setView('landing');
  const goToOverview = () => setView('overview');

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
          onSignUpSuccess={goToOverview}
        />
      )}
      {view === 'overview' && (
        <OverviewPage />
      )}
    </main>
  );
}