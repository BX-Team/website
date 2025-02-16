import Image from 'next/image';

import { DiscordIcon } from '@/components/icon/discord';
import type { BaseLayoutProps } from '@/components/shared';
import { siteConfig } from '@/config/site';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className='flex items-center gap-x-2 text-stone-800 dark:text-stone-100'>
        <Image src='/logo.png' alt='BX Team Logo' width={22} height={22} />
        <span>BX Team</span>
      </div>
    ),
    transparentMode: 'none',
  },
  disableThemeSwitch: true,
  githubUrl: siteConfig.links.github,
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'Team',
      url: '/team',
      active: 'nested-url',
    },
    {
      text: 'Status',
      url: siteConfig.links.status,
      active: 'nested-url',
    },
    {
      text: 'Maven',
      url: siteConfig.links.maven,
      active: 'nested-url',
    },
    {
      type: 'icon',
      label: 'aria-label',
      icon: <DiscordIcon />,
      text: 'Discord',
      url: siteConfig.links.discord,
    },
  ],
};
