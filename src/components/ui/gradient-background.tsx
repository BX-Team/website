import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  colors?: string[];
}

export function GradientBackground({
  colors = ['bg-gradient-to-tr from-cyan-600 from-0% to-sky-600 via-50% to-violet-400 to-100%'],
  className,
  ...props
}: GradientBackgroundProps) {
  return (
    <div
      aria-hidden='true'
      className={cn('absolute inset-x-1 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-30', className)}
      {...props}
    >
      <div
        className={cn(
          'relative left-[calc(50%-11rem)] aspect-[1155/678] w-[106.125rem] -translate-x-1/2 rotate-[20deg] bg-gradient-to-tr opacity-15 sm:left-[calc(50%-25rem)] sm:w-[72.1875rem]',
          ...colors,
        )}
        style={{
          clipPath:
            'polygon(24.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 15.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 12.4% 68.1%, 76.1% 97.7%, 74.1% 44.1%, 27.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 94.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
    </div>
  );
}
