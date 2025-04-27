import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      color: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-500',
        outline: 'border-2 border-neutral-700 text-neutral-200 hover:border-blue-500 hover:text-blue-500 bg-neutral-800',
        ghost: 'text-neutral-200 hover:bg-blue-500/10 hover:text-blue-500',
        secondary: 'bg-neutral-800 text-neutral-200 border-2 border-neutral-700 hover:border-blue-500/50',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        icon: 'p-1.5 [&_svg]:size-5',
        'icon-sm': 'p-1.5 [&_svg]:size-4.5',
        lg: 'h-11 rounded-md px-7',
      },
    },
    defaultVariants: {
      color: 'primary',
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
