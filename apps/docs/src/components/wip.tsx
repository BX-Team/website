import Link from 'next/link';

export default function WorkInProgress() {
  return (
    <div className='not-prose bg-fd-card flex flex-col items-center justify-center gap-2 rounded-lg p-8 text-center'>
      <p className='text-fd-muted-foreground'>
        Seems like this page is not ready yet. Check back soon for updates or contribute to the project.
      </p>
      <Link
        href='https://discord.gg/p7cxhw7E2M'
        className='decoration-fd-muted-foreground underline-offset-3 hover:decoration-fd-foreground font-medium underline transition-colors duration-200'
        target='_blank'
        rel='noopener noreferrer'
      >
        Discord Server
      </Link>
    </div>
  );
}
