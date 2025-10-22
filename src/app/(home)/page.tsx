import { Community } from '@/components/sections/community';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Community />
      <Footer />
    </>
  );
}
