import { Download } from 'lucide-react';
import { BuildsList } from '@/components/downloads/builds-list';
import { fetchDivineMCVersions } from '@/lib/mcjars';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { GitHubIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'DivineMC Downloads',
  description: 'Download the latest DivineMC builds for your Minecraft server',
};

export default async function DivineMCDownloadsPage() {
  let versions: string[] = [];
  let versionInfo: Record<string, { total: number; uniqueIps: number }> = {};
  let error: string | null = null;

  try {
    const response = await fetchDivineMCVersions();
    if (response.success) {
      versionInfo = response.versions;
      versions = Object.keys(response.versions).sort((a, b) => {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aNum = aParts[i] || 0;
          const bNum = bParts[i] || 0;
          if (aNum !== bNum) return bNum - aNum;
        }
        return 0;
      });
    } else {
      error = 'Failed to load versions';
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load versions';
  }

  return (
    <div className='relative min-h-screen'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'>
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]' />
      </div>

      <main className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12'>
        <header className='max-w-2xl text-center mx-auto mb-12'>
          <h1 className='font-semibold text-4xl text-white mb-3'>DivineMC Downloads</h1>
          <p className='text-lg text-neutral-300'>Get the latest builds of DivineMC for your Minecraft server</p>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row justify-center'>
            <Button asChild color='primary' size='lg' className='cursor-pointer'>
              <a href='/docs/divinemc'>Documentation</a>
            </Button>
            <Button asChild color='secondary' size='lg' className='cursor-pointer'>
              <a href='https://github.com/BX-Team/DivineMC' target='_blank' rel='noopener noreferrer'>
                <GitHubIcon className='size-5 mr-2' />
                Source Code
              </a>
            </Button>
          </div>
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
                <h3 className='text-xl font-semibold text-neutral-100 mb-2'>Failed to Load Versions</h3>
                <p className='text-neutral-400 max-w-md mx-auto'>{error}</p>
              </div>
            </div>
          ) : versions.length > 0 ? (
            <div className='border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 backdrop-blur-sm'>
              <BuildsList initialVersions={versions} versionInfo={versionInfo} />
            </div>
          ) : (
            <div className='border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 backdrop-blur-sm'>
              <div className='flex flex-col items-center justify-center py-24 text-center'>
                <Download className='size-12 text-neutral-400 mb-4' />
                <h3 className='text-xl font-semibold text-neutral-100 mb-2'>No Versions Available</h3>
                <p className='text-neutral-400 max-w-md mx-auto'>There are currently no DivineMC builds available.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
