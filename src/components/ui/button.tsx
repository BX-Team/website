import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      color: {
        primary: 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80',
        outline: 'hover:bg-fd-accent hover:text-fd-accent-foreground border',
        ghost: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
        secondary: 'bg-neutral-800 text-neutral-50 hover:bg-neutral-800/80',
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
