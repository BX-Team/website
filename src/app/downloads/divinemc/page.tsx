import { Download, GitCommit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const dynamic = 'force-dynamic';

type Build = {
  buildNumber: number;
  minecraftVersion: string;
  commits: { hash: string; message: string }[];
  downloadUrl: string | null;
};

async function getBuilds(): Promise<Build[]> {
  const res = await fetch('https://api.github.com/repos/BX-Team/DivineMC/releases');
  if (!res.ok) {
    throw new Error('Failed to fetch releases from GitHub');
  }
  const releases = await res.json();

  const sortedReleases = releases
    .map((release: any) => {
      const [version, buildNumberStr, commitHash] = release.tag_name.split('-');
      return { release, buildNumber: parseInt(buildNumberStr, 10) };
    })
    .sort((a: { buildNumber: number }, b: { buildNumber: number }) => b.buildNumber - a.buildNumber);

  const builds: Build[] = [];
  for (let i = 0; i < sortedReleases.length; i++) {
    const currentRelease = sortedReleases[i].release;
    const [version, buildNumberStr, commitHash] = currentRelease.tag_name.split('-');
    const buildNumber = parseInt(buildNumberStr, 10);
    const branch = currentRelease.target_commitish;
    const minecraftVersion = branch === 'master' ? 'Latest' : branch.replace('ver/', '');

    let commits: { hash: string; message: string }[] = [];

    if (i < sortedReleases.length - 1) {
      const previousRelease = sortedReleases[i + 1].release;
      const [, , prevCommitHash] = previousRelease.tag_name.split('-');
      try {
        const compareRes = await fetch(
          `https://api.github.com/repos/BX-Team/DivineMC/compare/${prevCommitHash}...${commitHash}`,
        );
        if (compareRes.ok) {
          const compareData = await compareRes.json();
          commits = compareData.commits.reverse().map((commit: any) => ({
            hash: commit.sha,
            message: commit.commit.message.split('\n')[0] || 'No commit message',
          }));
        }
      } catch (error) {
        commits = [
          {
            hash: commitHash,
            message: currentRelease.name || currentRelease.body || 'No commit message',
          },
        ];
      }
    } else {
      commits = [
        {
          hash: commitHash,
          message: currentRelease.name || currentRelease.body || 'No commit message',
        },
      ];
    }

    builds.push({
      buildNumber,
      minecraftVersion,
      commits,
      downloadUrl: currentRelease.assets?.[0]?.browser_download_url || null,
    });
  }

  return builds;
}

function BuildRow({ build, isLatest }: { build: Build; isLatest: boolean }) {
  const { buildNumber, commits, downloadUrl } = build;
  const MAX_COMMITS = 5;

  return (
    <div className='flex flex-col justify-between gap-4 border-t border-neutral-800 py-4 sm:flex-row sm:items-center'>
      <div className='flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center'>
        <span className='w-fit shrink-0 rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-300'>
          #{buildNumber}
        </span>

        <div className='min-w-0 flex-1 space-y-2'>
          {commits.length === 0 ? (
            <span className='text-sm text-neutral-300 italic'>No changes found</span>
          ) : (
            commits.slice(0, MAX_COMMITS).map((commit) => (
              <div key={commit.hash} className='min-w-0 space-y-1'>
                <div className='flex min-w-0 items-center gap-1.5'>
                  <a
                    href={`https://github.com/BX-Team/DivineMC/commit/${commit.hash}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex shrink-0 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-400'
                  >
                    <GitCommit className='size-3.5' />
                    {commit.hash.slice(0, 7)}
                  </a>
                  <p className='min-w-0 truncate text-sm text-neutral-300'>{commit.message || 'No commit message'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Button
        color={isLatest ? 'primary' : 'secondary'}
        asChild={!!downloadUrl}
        disabled={!downloadUrl}
        className='w-full shrink-0 sm:w-auto'
      >
        {downloadUrl ? (
          <a href={downloadUrl} download className='inline-flex items-center gap-2'>
            <Download className='size-4' />
            Download
          </a>
        ) : (
          <span className='inline-flex items-center gap-2'>
            <Download className='size-4' />
            Unavailable
          </span>
        )}
      </Button>
    </div>
  );
}

export default async function DownloadsPage() {
  const builds = await getBuilds();

  const buildsByVersion = builds.reduce<Record<string, Build[]>>((grouped, build) => {
    grouped[build.minecraftVersion] ??= [];
    grouped[build.minecraftVersion].push(build);
    return grouped;
  }, {});

  const versions = Object.keys(buildsByVersion).sort((a, b) => {
    if (a === 'Latest') return -1;
    if (b === 'Latest') return 1;
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aNum = aParts[i] || 0;
      const bNum = bParts[i] || 0;
      if (aNum !== bNum) {
        return bNum - aNum;
      }
    }
    return 0;
  });
  const latestVersion = versions[0];
  const latestBuilds = buildsByVersion[latestVersion]?.slice(0, 10) ?? [];

  return (
    <section className='mt-12 sm:mt-16'>
      <Card className='p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <Select defaultValue={latestVersion}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select version' />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version === 'Latest' ? 'Latest' : `Minecraft ${version}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          {latestBuilds.map((build, index) => (
            <BuildRow key={build.buildNumber} build={build} isLatest={index === 0} />
          ))}
        </div>

        <div className='mt-8 text-center'>
          <a
            href='https://github.com/BX-Team/DivineMC/releases'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-neutral-400 hover:text-neutral-300'
          >
            Looking for older builds? Check out our GitHub releases →
          </a>
        </div>
      </Card>
    </section>
  );
}
