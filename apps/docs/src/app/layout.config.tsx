import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import Image from 'next/image';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className='flex items-center gap-2'>
        <Image src='/logo.png' alt='BX Team Logo' width={24} height={24} />
        <span>BX Team Docs</span>
      </div>
    ),
  },
  disableThemeSwitch: true,
};
