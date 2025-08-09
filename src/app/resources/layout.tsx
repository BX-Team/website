import type { ReactNode } from 'react';

import { baseOptions } from '@/app/layout.config';
import { Footer } from '@/components/sections/footer';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HomeLayout {...baseOptions} themeSwitch={{ enabled: false }}>
        {children}
        <Footer />
      </HomeLayout>
    </>
  );
}
