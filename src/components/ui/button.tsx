import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import type * as React from 'react';

import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      color: {
        default: 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80',
        outline: 'border hover:bg-fd-accent hover:text-fd-accent-foreground',
        ghost: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
        secondary:'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'gap-1 p-0.5 text-xs',
        lg: 'h-11 rounded-md px-7',
        icon: 'p-1.5 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      color: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps<T extends React.ElementType = 'button'> = {
  asChild?: boolean;
  className?: string;
  as?: T;
} & VariantProps<typeof buttonVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, 'className'>;

export function Button<T extends React.ElementType = 'button'>({
  className,
  color,
  size,
  asChild = false,
  as,
  ...props
}: ButtonProps<T>) {
  const Comp = asChild ? Slot : as || 'button';
  return <Comp className={cn(buttonVariants({ color, size, className }))} {...props} />;
}
