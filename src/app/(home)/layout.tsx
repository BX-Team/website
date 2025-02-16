import type { ReactNode } from 'react';
import React from 'react';

import { baseOptions } from '@/app/layout.config';
import { HomeLayout } from '@/components/home';
import { Navbar } from '@/components/home/navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
