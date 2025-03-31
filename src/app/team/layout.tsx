import type { ReactNode } from 'react';

import { baseOptions } from '@/app/layout.config';
import { Footer } from '@/components/footer';
import { HomeLayout } from '@/components/layouts/home';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HomeLayout {...baseOptions}>
        {children}
        <Footer />
      </HomeLayout>
      ;
    </>
  );
}
