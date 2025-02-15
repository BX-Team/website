import Link from 'next/link';

import { siteConfig } from '@/config/site';

export default function WorkInProgress() {
  return (
    <div className='not-prose bg-fd-card flex flex-col items-center justify-center gap-2 rounded-lg p-8 text-center'>
      <p className='text-fd-muted-foreground'>
        Seems like this page is not ready yet. Check back soon for updates and join our Discord server.
      </p>
      <Link
        href={siteConfig.links.discord}
        className='decoration-fd-muted-foreground hover:decoration-fd-foreground font-medium underline underline-offset-3 transition-colors duration-200'
        target='_blank'
        rel='noopener noreferrer'
      >
        Discord server
      </Link>
    </div>
  );
}
