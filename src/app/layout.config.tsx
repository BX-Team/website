import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Atom, Cloudy, Cuboid, DollarSign, Drill } from 'lucide-react';

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
  themeSwitch: { enabled: false },
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
          description:
            'Multi-functional fork of Purpur, which focuses on the flexibility of your server and its optimization.',
          url: '/docs/divinemc',
          menu: {
            className: 'lg:col-start-1 lg:row-start-1 lg:col-span-1',
          },
        },
        {
          icon: <Atom />,
          text: 'Quark',
          description:
            'A lightweight, runtime dependency management system for plugins running on Minecraft server platforms.',
          url: '/docs/quark',
          menu: {
            className: 'lg:col-start-2 lg:row-start-1 lg:col-span-1',
          },
        },
        {
          icon: <DollarSign />,
          text: 'NDailyRewards',
          description:
            'Simple and lightweight plugin that allows you to reward your players for playing on your server every day.',
          url: '/docs/ndailyrewards',
          menu: {
            className: 'lg:col-start-3 lg:row-start-1 lg:col-span-1',
          },
        },
        {
          icon: <Cloudy />,
          text: 'RealWorldSync',
          description: 'Synchronize time and weather from the real world to the game.',
          url: '/docs/realworldsync',
          menu: {
            className: 'lg:col-start-4 lg:row-start-1 lg:col-span-1',
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
