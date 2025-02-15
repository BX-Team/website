import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function WorkInProgress() {
  return (
    <div className='not-prose flex flex-col items-center justify-center gap-2 rounded-lg bg-fd-card p-8 text-center'>
      <p className='text-fd-muted-foreground'>
        Seems like this page is not ready yet. Check back soon for updates and join our Discord server.
      </p>
      <Link
        href={siteConfig.links.discord}
        className='font-medium underline decoration-fd-muted-foreground underline-offset-3 transition-colors duration-200 hover:decoration-fd-foreground'
        target='_blank'
        rel='noopener noreferrer'
      >
        Discord server
      </Link>
    </div>
  );
}
