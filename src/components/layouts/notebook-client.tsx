'use client';

import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { SidebarTrigger } from 'fumadocs-core/sidebar';
import { useNav } from 'fumadocs-ui/contexts/layout';
import { useSidebar } from 'fumadocs-ui/contexts/sidebar';
import { Menu, X } from 'lucide-react';

import { type ButtonHTMLAttributes, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import { isActive } from '../../lib/is-active';
import type { Option } from '../layout/root-toggle';
import { buttonVariants } from '../ui/button';

export function Navbar({ mode, ...props }: HTMLAttributes<HTMLElement> & { mode: 'top' | 'auto' }) {
  const { open, collapsed } = useSidebar();
  const { isTransparent } = useNav();

  return (
    <header
      id='nd-subnav'
      {...props}
      className={cn(
        'fixed inset-x-0 top-(--fd-banner-height) z-10 px-(--fd-layout-offset) backdrop-blur-lg transition-colors',
        (!isTransparent || open) && 'bg-fd-background/80',
        mode === 'auto' && !collapsed && 'ps-[calc(var(--fd-layout-offset)+var(--fd-sidebar-width))]',
        props.className,
      )}
    >
      {props.children}
    </header>
  );
}

export function NavbarSidebarTrigger(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open } = useSidebar();

  return (
    <SidebarTrigger
      {...props}
      className={cn(
        buttonVariants({
          color: 'ghost',
          size: 'icon',
        }),
        props.className,
      )}
    >
      {open ? <X /> : <Menu />}
    </SidebarTrigger>
  );
}

export function LayoutTabs(props: HTMLAttributes<HTMLElement>) {
  return (
    <div {...props} className={cn('flex flex-row items-end gap-6 overflow-auto', props.className)}>
      {props.children}
    </div>
  );
}

function useIsSelected(item: Option) {
  const pathname = usePathname();

  return item.urls
    ? item.urls.has(pathname.endsWith('/') ? pathname.slice(0, -1) : pathname)
    : isActive(item.url, pathname, true);
}

export function LayoutTab(item: Option) {
  const { closeOnRedirect } = useSidebar();
  const selected = useIsSelected(item);

  return (
    <Link
      className={cn(
        'text-fd-muted-foreground inline-flex items-center gap-2 border-b border-transparent py-2.5 text-sm text-nowrap',
        selected && 'text-fd-foreground border-fd-primary font-medium',
      )}
      href={item.url}
      onClick={() => {
        closeOnRedirect.current = false;
      }}
    >
      {item.title}
    </Link>
  );
}

export function SidebarLayoutTab({ item, ...props }: { item: Option } & HTMLAttributes<HTMLElement>) {
  const selected = useIsSelected(item);

  return (
    <Link
      {...props}
      className={cn(
        'text-fd-muted-foreground -mx-2 flex flex-row items-center gap-2.5 px-2 py-1.5 [&_svg]:!size-4.5',
        selected ? 'text-fd-primary font-medium' : 'hover:text-fd-accent-foreground',
        props.className,
      )}
      data-active={selected}
      href={item.url}
    >
      {item.icon}
      {item.title}
    </Link>
  );
}
