import { Download, ArrowRight } from 'lucide-react';
import { fetchProjects } from '@/lib/atlas';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download the latest builds of our Minecraft server software',
};

export default async function DownloadsPage() {
  let projects: Awaited<ReturnType<typeof fetchProjects>>['projects'] = [];
  let error: string | null = null;

  try {
    const response = await fetchProjects();
    projects = response.projects;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load projects';
  }

  return (
    <div className='relative min-h-screen'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'>
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]' />
      </div>

      <main className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12'>
        <header className='max-w-2xl text-center mx-auto mb-12'>
          <h1 className='font-semibold text-4xl text-white mb-3'>Downloads</h1>
          <p className='text-lg text-neutral-300'>Download the latest builds of our Minecraft server software</p>
        </header>

        <section className='mt-12 sm:mt-16'>
          {error ? (
            <div className='border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 backdrop-blur-sm'>
              <div className='flex flex-col items-center justify-center py-24 text-center'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4'>
                  <svg className='w-8 h-8 text-red-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-neutral-100 mb-2'>Failed to Load Projects</h3>
                <p className='text-neutral-400 max-w-md mx-auto'>{error}</p>
              </div>
            </div>
          ) : projects.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {projects.map(project => (
                <Link
                  key={project.project.id}
                  href={`/downloads/${project.project.id}`}
                  className='group border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all bg-neutral-900/30 backdrop-blur-sm hover:bg-neutral-900/50'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                      <h3 className='text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors'>
                        {project.project.name}
                      </h3>
                      <p className='text-sm text-neutral-400'>
                        {project.versions.length} version{project.versions.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                    <ArrowRight className='size-5 text-neutral-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all' />
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {project.versions.slice(0, 5).map(version => (
                      <span
                        key={version}
                        className='px-2 py-1 text-xs font-medium bg-neutral-800 text-neutral-300 rounded'
                      >
                        {version}
                      </span>
                    ))}
                    {project.versions.length > 5 && (
                      <span className='px-2 py-1 text-xs font-medium text-neutral-500'>
                        +{project.versions.length - 5} more
                      </span>
                    )}
                  </div>

                  <div className='mt-4 pt-4 border-t border-neutral-800'>
                    <Button asChild color='primary' size='sm' className='cursor-pointer w-full'>
                      <span className='flex items-center justify-center gap-2'>
                        <Download className='size-4' />
                        View Downloads
                      </span>
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 backdrop-blur-sm'>
              <div className='flex flex-col items-center justify-center py-24 text-center'>
                <Download className='size-12 text-neutral-400 mb-4' />
                <h3 className='text-xl font-semibold text-neutral-100 mb-2'>No Projects Available</h3>
                <p className='text-neutral-400 max-w-md mx-auto'>
                  There are currently no projects available for download.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
