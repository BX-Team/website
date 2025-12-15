import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='relative min-h-screen flex items-center justify-center'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'>
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]' />
      </div>

      <main className='mx-auto max-w-2xl px-6 py-20 sm:px-8 text-center'>
        <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-800 mb-6'>
          <span className='text-4xl font-bold text-neutral-300'>404</span>
        </div>

        <h1 className='font-semibold text-3xl text-white mb-3'>Project Not Found</h1>
        <p className='text-lg text-neutral-400 mb-8'>
          The project you're looking for doesn't exist or has been removed.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button asChild color='primary' size='lg' className='cursor-pointer'>
            <Link href='/downloads'>
              <ArrowLeft className='size-4 mr-2' />
              Back to Downloads
            </Link>
          </Button>
          <Button asChild color='secondary' size='lg' className='cursor-pointer'>
            <Link href='/'>
              <Home className='size-4 mr-2' />
              Go Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
