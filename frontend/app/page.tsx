"use client";

import { useState } from 'react';
import LandingPage from './landing/page';
import { LoginPage } from './login/page';
import { SignUpPage } from './sign-up/page';
import {OverviewPage} from './user/overview/dash';
import MyBadgesPage from './user/badges/mybadge';
import Request_Professor from './professor/request/page';

export default function Home() {



  return (
    
    
    // <LandingPage />
     <OverviewPage/>
     //<MyBadgesPage/>
     //<Request_Professor />
  );
}