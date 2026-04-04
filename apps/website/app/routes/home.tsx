import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Community } from '@/components/sections/community';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';
import { baseOptions } from '@/lib/layout.shared';

export function meta(_args: unknown) {
  return [
    { title: 'BX Team' },
    {
      name: 'description',
      content:
        'BX Team is an open source community that focuses on development and maintenance of high-quality Minecraft server software.',
    },
  ];
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <Hero />
      <Projects />
      <Community />
      <Footer />
    </HomeLayout>
  );
}
