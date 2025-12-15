import { Download, ArrowRight, Clock, GitCommit, Package } from 'lucide-react';
import { fetchProjects, fetchLatestBuild, getChannelColor, getAllVersions } from '@/lib/atlas';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';
import { formatFileSize } from '@/lib/atlas';

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

    const projectsWithBuilds = await Promise.all(
      projects.map(async project => {
        const versions = getAllVersions(project.version_groups);
        const latestVersion = project.project.latestVersion || versions[0];

        if (latestVersion) {
          try {
            const latestBuild = await fetchLatestBuild(project.project.id, latestVersion);
            return { ...project, latestBuild };
          } catch {
            return { ...project, latestBuild: null };
          }
        }
        return { ...project, latestBuild: null };
      }),
    );

    projects = projectsWithBuilds as typeof projects;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load projects';
  }

  return (
    <div className='relative min-h-screen'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'>
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]' />
      </div>

      <main className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12'>
        <header className='max-w-3xl mx-auto mb-12'>
          <h1 className='font-semibold text-4xl text-white mb-3 text-center'>Downloads</h1>
          <p className='text-lg text-neutral-300 text-center'>Select software you want to download</p>
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
          ) : (
            <>
              {projects.length > 0 ? (
                <div className='flex flex-col gap-6 max-w-4xl mx-auto'>
                  {projects.map((project: any) => (
                    <div
                      key={project.project.id}
                      className='border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/30 backdrop-blur-sm hover:border-neutral-700 transition-all group'
                    >
                      <div className='p-6 pb-4'>
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <Link
                              href={`/downloads/${project.project.id}`}
                              className='inline-block group-hover:text-blue-400 transition-colors'
                            >
                              <h3 className='text-2xl font-bold text-white mb-2'>{project.project.name}</h3>
                            </Link>
                            <p className='text-sm text-neutral-400 leading-relaxed'>
                              {project.project.description || 'No description available.'}
                            </p>
                          </div>
                        </div>

                        {project.latestBuild && (
                          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4'>
                            <div className='bg-neutral-800/50 rounded-lg p-3'>
                              <div className='text-xs text-neutral-400 mb-1'>Latest Build</div>
                              <div className='text-lg font-bold text-white'>#{project.latestBuild.id}</div>
                            </div>
                            <div className='bg-neutral-800/50 rounded-lg p-3'>
                              <div className='text-xs text-neutral-400 mb-1'>Channel</div>
                              <div className='flex items-center gap-1.5'>
                                <span
                                  className={`px-2 py-0.5 text-xs font-medium border rounded ${getChannelColor(project.latestBuild.channel)}`}
                                >
                                  {project.latestBuild.channel}
                                </span>
                              </div>
                            </div>
                            <div className='bg-neutral-800/50 rounded-lg p-3'>
                              <div className='text-xs text-neutral-400 mb-1'>Size</div>
                              <div className='text-sm font-bold text-white flex items-center gap-1'>
                                <Package className='size-3' />
                                {formatFileSize(project.latestBuild.downloads.application.size)}
                              </div>
                            </div>
                            <div className='bg-neutral-800/50 rounded-lg p-3'>
                              <div className='text-xs text-neutral-400 mb-1'>Updated</div>
                              <div className='text-sm font-bold text-white flex items-center gap-1'>
                                <Clock className='size-3' />
                                {new Date(project.latestBuild.time).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {project.latestBuild && project.latestBuild.commits.length > 0 && (
                        <div className='px-6 pb-4 pt-2 border-t border-neutral-800/50'>
                          <div className='flex items-center gap-2 mb-3'>
                            <GitCommit className='size-4 text-neutral-400' />
                            <h4 className='text-xs font-medium text-neutral-400 uppercase tracking-wider'>
                              Recent Changes
                            </h4>
                          </div>
                          <div className='space-y-2'>
                            {project.latestBuild.commits.slice(0, 3).map((commit: any) => (
                              <div key={commit.sha} className='flex items-start gap-2 text-sm'>
                                <span className='text-neutral-600 mt-1 shrink-0'>•</span>
                                <div className='flex-1 min-w-0'>
                                  <a
                                    href={`https://github.com/BX-Team/${project.project.name}/commit/${commit.sha}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-400 hover:text-blue-300 font-mono text-xs transition-colors'
                                  >
                                    {commit.sha.substring(0, 7)}
                                  </a>
                                  <p className='text-neutral-400 text-xs mt-0.5 line-clamp-1'>{commit.message}</p>
                                </div>
                              </div>
                            ))}
                            {project.latestBuild.commits.length > 3 && (
                              <p className='text-xs text-neutral-500 pl-4'>
                                +{project.latestBuild.commits.length - 3} more commits
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className='px-6 pb-6 pt-4 border-t border-neutral-800/50 flex gap-3'>
                        {project.latestBuild && (
                          <Button
                            asChild
                            size='default'
                            className='cursor-pointer bg-white text-neutral-900 hover:bg-neutral-100 flex-1'
                          >
                            <a
                              href={project.latestBuild.downloads.application.url}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <Download className='size-4 mr-2' />
                              Download Latest
                            </a>
                          </Button>
                        )}
                        <Button asChild color='secondary' size='default' className='cursor-pointer flex-1'>
                          <Link href={`/downloads/${project.project.id}`}>
                            <ArrowRight className='size-4 mr-2' />
                            All Builds
                          </Link>
                        </Button>
                      </div>
                    </div>
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
            </>
          )}
        </section>
      </main>
    </div>
  );
}
