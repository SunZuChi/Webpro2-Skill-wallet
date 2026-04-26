"use client";

import { useState } from 'react';
import { LandingPage } from './landing/landing';
import { LoginPage } from './authen/login';
import { SignUpPage } from './authen/sign-up';
import {OverviewPage} from './user/overview/dash';
import MyBadgesPage from './user/badges/mybadge';

export default function Home() {



  return (
    // <main className="min-h-screen">
    //   {view === 'landing' && (
    //     <LandingPage 
    //       onLoginClick={goToLogin}
    //       onSignUpClick={goToSignUp} 
    //       onBackToLanding={goToLanding}
    //     />
        
    //   )}
    //   {view === 'login' && (
    //     <LoginPage 
    //       onBackToLanding={goToLanding}
    //     />
    //   )}
    //   {view === 'signup' && (
    //     <SignUpPage 
    //       onBackToLanding={goToLanding}
    //     />
    //   )}
 
    // </main>
    

    <OverviewPage/>
     //<MyBadgesPage/>
  );
}