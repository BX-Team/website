import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'flex h-10 w-full rounded-md border-2 border-neutral-700',
        'bg-neutral-800 px-3 py-2 text-sm text-neutral-200',
        'placeholder:text-neutral-500',
        'focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/50',
        'transition-colors hover:border-blue-500/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
