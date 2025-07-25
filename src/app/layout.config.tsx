import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Cloudy, Cuboid, DollarSign, Drill } from 'lucide-react';

import Image from 'next/image';

import { siteConfig } from '@/config/site';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className='flex items-center gap-2'>
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
      type: 'menu',
      text: 'Documentation',
      url: '/docs',
      items: [
        {
          icon: <Cuboid />,
          text: 'DivineMC',
          description: 'Fork of Purpur compatible with Spigot plugins, offering the best performance for your server.',
          url: '/docs/divinemc',
          menu: {
            className: 'flex-1 min-w-0',
          },
        },
        {
          icon: <DollarSign />,
          text: 'NDailyRewards',
          description:
            'Simple and lightweight plugin that allows you to reward your players for playing on your server every day.',
          url: '/docs/ndailyrewards',
          menu: {
            className: 'flex-1 min-w-0',
          },
        },
        {
          icon: <Cloudy />,
          text: 'RealWorldSync',
          description: 'Synchronize time and weather from the real world to the game.',
          url: '/docs/realworldsync',
          menu: {
            className: 'flex-1 min-w-0',
          },
        },
      ],
    },
    {
      text: 'Resources',
      url: '/resources',
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
  ],
};
