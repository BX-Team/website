import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { GradientBackground } from '@/components/ui/gradient-background';

export default async function ResourcesPage() {
  const sections = [
    {
      title: 'Server Tools',
      sub: 'Tools to help configure and setup Minecraft servers.',
      items: [
        {
          title: 'Flags Generator',
          href: '/resources/flags',
          desc: 'A script generator to start your Minecraft servers with optimal flags',
        },
      ],
    },
  ];

  return (
    <div className='relative min-h-screen'>
      <GradientBackground />
      <div className='mx-auto max-w-7xl px-6 py-16 pb-32 sm:px-8 sm:py-20 sm:pb-40 lg:px-12'>
        <header className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold sm:text-4xl lg:text-5xl'>Resources</h1>
          <p className='mt-4 text-neutral-300 sm:text-lg'>
            A collection of tools and resources to help you with your Minecraft server.
          </p>
        </header>

        {sections.map(sec => (
          <section key={sec.title} className='mt-12 sm:mt-16'>
            <h2 className='text-2xl font-semibold text-white'>{sec.title}</h2>
            <p className='mt-2 mb-6 text-neutral-300'>{sec.sub}</p>
            <div className='grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-6'>
              {sec.items.map(item => (
                <Link key={item.title} href={item.href} passHref>
                  <Card className='p-5 transition-all hover:bg-neutral-800/50 hover:ring-1 hover:ring-neutral-700'>
                    <h3 className='font-semibold text-white'>{item.title}</h3>
                    <p className='mt-2 text-sm text-neutral-400'>{item.desc}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
