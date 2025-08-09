import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';
import { Community } from '@/components/sections/community';

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
