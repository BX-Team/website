import type { PageTree } from 'fumadocs-core/server';
import { TreeContextProvider } from 'fumadocs-ui/provider';
import { type PageStyles, StylesProvider } from 'fumadocs-ui/provider';
import { ChevronDown, Languages } from 'lucide-react';

import { Fragment, type HTMLAttributes, ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '../lib/cn';
import {
  SidebarLinkItem,
  type SidebarOptions,
  checkPageTree,
  getSidebarTabsFromOptions,
  layoutVariables,
} from './docs/shared';
import {
  CollapsibleSidebar,
  Sidebar,
  SidebarCollapseTrigger,
  SidebarFooter,
  SidebarHeader,
  SidebarPageTree,
  SidebarViewport,
} from './docs/sidebar';
import { LanguageToggle } from './layout/language-toggle';
import { NavProvider, Title } from './layout/nav';
import { type Option, RootToggle } from './layout/root-toggle';
import { LargeSearchToggle, SearchToggle } from './layout/search-toggle';
import { ThemeToggle } from './layout/theme-toggle';
import { BaseLinkItem, type LinkItemType } from './links';
import { LayoutTab, LayoutTabs, Navbar, NavbarSidebarTrigger, SidebarLayoutTab } from './notebook.client';
import { type BaseLayoutProps, type SharedNavProps, getLinks } from './shared';
import { buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  tabMode?: 'sidebar' | 'navbar';
  disableThemeSwitch?: boolean;

  nav?: BaseLayoutProps['nav'] & {
    mode?: 'top' | 'auto';
  };

  sidebar?: Omit<Partial<SidebarOptions>, 'component' | 'enabled'>;

  containerProps?: HTMLAttributes<HTMLDivElement>;
}

export function DocsLayout({
  tabMode = 'sidebar',
  nav: { transparentMode, ...nav } = {},
  sidebar: {
    collapsible: sidebarCollapsible = true,
    tabs: tabOptions,
    banner: sidebarBanner,
    footer: sidebarFooter,
    components: sidebarComponents,
    ...sidebar
  } = {},
  i18n = false,
  disableThemeSwitch = false,
  ...props
}: DocsLayoutProps) {
  checkPageTree(props.tree);
  const navMode = nav.mode ?? 'auto';
  const links = getLinks(props.links ?? [], props.githubUrl);
  const Aside = sidebarCollapsible ? CollapsibleSidebar : Sidebar;

  const tabs = getSidebarTabsFromOptions(tabOptions, props.tree) ?? [];
  const variables = cn(
    '[--fd-nav-height:calc(var(--spacing)*14)] [--fd-tocnav-height:36px] md:[--fd-sidebar-width:286px] xl:[--fd-toc-width:286px] xl:[--fd-tocnav-height:0px]',
    tabs.length > 0 && tabMode === 'navbar' && 'lg:[--fd-nav-height:calc(var(--spacing)*26)]',
  );

  const pageStyles: PageStyles = {
    tocNav: cn('xl:hidden'),
    toc: cn('max-xl:hidden'),
    page: cn('mt-(--fd-nav-height)'),
  };

  return (
    <TreeContextProvider tree={props.tree}>
      <NavProvider transparentMode={transparentMode}>
        <main
          id='nd-docs-layout'
          {...props.containerProps}
          className={cn(
            'flex w-full flex-1 flex-row pe-(--fd-layout-offset)',
            variables,
            props.containerProps?.className,
          )}
          style={{
            ...layoutVariables,
            ...props.containerProps?.style,
          }}
        >
          <Aside
            {...sidebar}
            className={cn(
              'md:ps-(--fd-layout-offset)',
              navMode === 'top' ? 'bg-transparent *:!pt-0' : 'md:[--fd-nav-height:0px]',
              sidebar.className,
            )}
          >
            <SidebarHeader>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {nav.title && navMode === 'auto' ? (
                    <Link
                      href={nav.url ?? '/'}
                      className='inline-flex items-center gap-2.5 py-1 font-medium max-md:hidden'
                    >
                      {nav.title}
                    </Link>
                  ) : null}
                  {nav.children}
                </div>
                {sidebarCollapsible ? (
                  <SidebarCollapseTrigger
                    className={cn(
                      buttonVariants({
                        color: 'ghost',
                        size: 'icon',
                      }),
                      'text-fd-muted-foreground max-md:hidden', // Hide on mobile devices
                    )}
                  />
                ) : null}
              </div>
              {sidebarBanner}
              {tabMode === 'sidebar' && tabs.length > 0 ? <RootToggle options={tabs} className='-mx-2' /> : null}
            </SidebarHeader>
            <SidebarViewport>
              {tabMode === 'navbar' &&
                tabs.map((tab, i) => (
                  <SidebarLayoutTab
                    key={tab.url}
                    item={tab}
                    className={cn('lg:hidden', i === tabs.length - 1 && 'mb-4')}
                  />
                ))}
              {links.map((item, i) => (
                <SidebarLinkItem key={i} item={item} className={cn('lg:hidden', i === links.length - 1 && 'mb-4')} />
              ))}

              <SidebarPageTree components={sidebarComponents} />
            </SidebarViewport>
            <SidebarFooter className={cn(!sidebarFooter && 'md:hidden')}>
              {!disableThemeSwitch ? <ThemeToggle className='w-fit md:hidden' mode='light-dark-system' /> : null}
              {sidebarFooter}
            </SidebarFooter>
          </Aside>
          <DocsNavbar
            nav={nav}
            links={links}
            i18n={i18n}
            sidebarCollapsible={sidebarCollapsible}
            tabs={tabMode == 'navbar' ? tabs : []}
            disableThemeSwitch={disableThemeSwitch}
          />
          <StylesProvider {...pageStyles}>{props.children}</StylesProvider>
        </main>
      </NavProvider>
    </TreeContextProvider>
  );
}

function DocsNavbar({
  sidebarCollapsible,
  links,
  nav = {},
  i18n,
  tabs,
  disableThemeSwitch,
}: {
  nav: DocsLayoutProps['nav'];
  sidebarCollapsible: boolean;
  i18n: boolean;
  links: LinkItemType[];
  tabs: Option[];
  disableThemeSwitch: boolean;
}) {
  const navMode = nav.mode ?? 'auto';

  return (
    <Navbar
      className={cn('flex h-14 flex-col', tabs.length > 0 && 'lg:h-26')}
      style={
        navMode === 'top'
          ? {
              paddingInlineStart: 'var(--fd-layout-offset)',
            }
          : undefined
      }
    >
      <div className='border-fd-foreground/10 flex flex-1 flex-row border-b px-4 md:px-6'>
        <div className={cn('flex flex-row items-center', navMode === 'top' && 'flex-1')}>
          <Title url={nav.url} title={nav.title} className={cn(navMode === 'auto' ? 'md:hidden' : 'pe-6')} />
        </div>

        <LargeSearchToggle
          hideIfDisabled
          className={cn(
            'my-auto w-full rounded-xl max-md:hidden',
            navMode === 'top' ? 'max-w-sm px-2' : 'max-w-[240px]',
          )}
        />

        <div className='flex flex-1 flex-row items-center justify-end md:gap-2'>
          <div className='flex flex-row items-center gap-6 px-4 empty:hidden max-lg:hidden'>
            {links
              .filter((item) => item.type !== 'icon')
              .map((item, i) => (
                <NavbarLinkItem
                  key={i}
                  item={item}
                  className='text-fd-muted-foreground hover:text-fd-accent-foreground text-sm transition-colors'
                />
              ))}
          </div>
          {nav.children}
          <SearchToggle hideIfDisabled className='md:hidden' />
          <NavbarSidebarTrigger className='md:hidden' />
          {links
            .filter((item) => item.type === 'icon')
            .map((item, i) => (
              <BaseLinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({ size: 'icon', color: 'ghost' }),
                  'text-fd-muted-foreground max-lg:hidden [&_svg]:size-4.5',
                )}
                aria-label={item.label}
              >
                {item.icon}
              </BaseLinkItem>
            ))}
          {i18n ? (
            <LanguageToggle>
              <Languages className='size-5' />
            </LanguageToggle>
          ) : null}
          {!disableThemeSwitch && <ThemeToggle className='max-md:hidden' mode='light-dark-system' />}
        </div>
      </div>
      {tabs.length > 0 ? (
        <LayoutTabs className='border-fd-foreground/10 border-b px-6 max-lg:hidden'>
          {tabs.map((tab) => (
            <LayoutTab key={tab.url} {...tab} />
          ))}
        </LayoutTabs>
      ) : null}
    </Navbar>
  );
}

function NavbarLinkItem({ item, ...props }: { item: LinkItemType } & HTMLAttributes<HTMLElement>) {
  if (item.type === 'menu') {
    return (
      <Popover>
        <PopoverTrigger {...props} className={cn('inline-flex items-center gap-1.5', props.className)}>
          {item.text}
          <ChevronDown className='size-3' />
        </PopoverTrigger>
        <PopoverContent className='flex flex-col'>
          {item.items.map((child, i) => {
            if (child.type === 'custom') return <Fragment key={i}>{child.children}</Fragment>;

            return (
              <BaseLinkItem
                key={i}
                item={child}
                className='hover:bg-fd-accent hover:text-fd-accent-foreground data-[active=true]:text-fd-primary inline-flex items-center gap-2 rounded-md p-2 text-start [&_svg]:size-4'
              >
                {child.icon}
                {child.text}
              </BaseLinkItem>
            );
          })}
        </PopoverContent>
      </Popover>
    );
  }

  if (item.type === 'custom') return item.children;

  return (
    <BaseLinkItem item={item} {...props}>
      {item.text}
    </BaseLinkItem>
  );
}
