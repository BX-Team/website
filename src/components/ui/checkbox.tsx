'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import type * as React from 'react';

import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn(
        'peer border-2 border-neutral-700 bg-neutral-800',
        'data-[state=checked]:border-white data-[state=checked]:bg-white',
        'focus-visible:ring-2 focus-visible:ring-white/50',
        'transition-colors hover:border-white/50',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        'size-5 shrink-0 rounded-md shadow-sm',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='flex items-center justify-center text-black transition-none'
      >
        <CheckIcon className='size-4' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
