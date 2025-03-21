import Link from 'fumadocs-core/link';
import { ChevronDown, Languages } from 'lucide-react';

import { Fragment, type HTMLAttributes } from 'react';

import { cn } from '../lib/cn';
import { Menu, MenuContent, MenuLinkItem, MenuTrigger } from './home/menu';
import { Navbar, NavbarLink, NavbarMenu, NavbarMenuContent, NavbarMenuLink, NavbarMenuTrigger } from './home/navbar';
import { LanguageToggle, LanguageToggleText } from './layout/language-toggle';
import { NavProvider, Title } from './layout/nav';
import { LargeSearchToggle, SearchToggle } from './layout/search-toggle';
import { ThemeToggle } from './layout/theme-toggle';
import { type LinkItemType } from './links';
import { type NavOptions, replaceOrDefault } from './shared';
import { type BaseLayoutProps, getLinks } from './shared';

export interface HomeLayoutProps extends BaseLayoutProps, HTMLAttributes<HTMLElement> {
  nav?: Partial<
    NavOptions & {
      /**
       * Open mobile menu when hovering the trigger
       */
      enableHoverToOpen?: boolean;
    }
  >;
}

export function HomeLayout(props: HomeLayoutProps) {
  const {
    nav,
    links,
    githubUrl,
    i18n: _i18n,
    themeSwitch: _themeSwitch,
    disableThemeSwitch: _disableThemeSwitch,
    ...rest
  } = props;

  const finalLinks = getLinks(links, githubUrl);

  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <main id='nd-home-layout' {...rest} className={cn('flex flex-1 flex-col pt-14', rest.className)}>
        {replaceOrDefault(nav, <Header finalLinks={finalLinks} {...props} />, {
          items: finalLinks,
        })}
        {props.children}
      </main>
    </NavProvider>
  );
}

function Header({
  nav: { enableSearch = true, ...nav } = {},
  i18n = false,
  finalLinks,
  themeSwitch,
}: HomeLayoutProps & {
  finalLinks: LinkItemType[];
}) {
  const navItems = finalLinks.filter((item) => ['nav', 'all'].includes(item.on ?? 'all'));
  const menuItems = finalLinks.filter((item) => ['menu', 'all'].includes(item.on ?? 'all'));

  return (
    <Navbar>
      <Title title={nav.title} url={nav.url} />
      {nav.children}
      <ul className='flex flex-row items-center gap-2 px-6 max-sm:hidden'>
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => (
            <NavbarLinkItem key={i} item={item} className='text-sm' />
          ))}
      </ul>
      <div className='flex flex-1 flex-row items-center justify-end gap-1.5'>
        {enableSearch ? (
          <>
            <SearchToggle className='lg:hidden' hideIfDisabled />
            <LargeSearchToggle className='w-full max-w-[240px] max-lg:hidden' hideIfDisabled />
          </>
        ) : null}
        {replaceOrDefault(themeSwitch, <ThemeToggle className='max-lg:hidden' mode={themeSwitch?.mode} />)}
        {i18n ? (
          <LanguageToggle className='max-lg:hidden'>
            <Languages className='size-5' />
          </LanguageToggle>
        ) : null}
      </div>
      <ul className='flex flex-row items-center'>
        {navItems.filter(isSecondary).map((item, i) => (
          <NavbarLinkItem key={i} item={item} className='-me-1.5 max-lg:hidden' />
        ))}
        <Menu className='lg:hidden'>
          <MenuTrigger aria-label='Toggle Menu' className='group -me-2' enableHover={nav.enableHoverToOpen}>
            <ChevronDown className='size-3 transition-transform duration-300 group-data-[state=open]:rotate-180' />
          </MenuTrigger>
          <MenuContent className='sm:flex-row sm:items-center sm:justify-end'>
            {menuItems
              .filter((item) => !isSecondary(item))
              .map((item, i) => (
                <MenuLinkItem key={i} item={item} className='sm:hidden' />
              ))}
            <div className='-ms-1.5 flex flex-row items-center gap-1.5 max-sm:mt-2'>
              {menuItems.filter(isSecondary).map((item, i) => (
                <MenuLinkItem key={i} item={item} className='-me-1.5' />
              ))}
              <div role='separator' className='flex-1' />
              {i18n ? (
                <LanguageToggle>
                  <Languages className='size-5' />
                  <LanguageToggleText />
                  <ChevronDown className='text-fd-muted-foreground size-3' />
                </LanguageToggle>
              ) : null}
              {replaceOrDefault(themeSwitch, <ThemeToggle mode={themeSwitch?.mode} />)}
            </div>
          </MenuContent>
        </Menu>
      </ul>
    </Navbar>
  );
}

function NavbarLinkItem({ item, ...props }: { item: LinkItemType; className?: string }) {
  if (item.type === 'custom') return item.children;

  if (item.type === 'menu') {
    const children = item.items.map((child, j) => {
      if (child.type === 'custom') return <Fragment key={j}>{child.children}</Fragment>;

      const { banner, footer, ...rest } = child.menu ?? {};

      return (
        <NavbarMenuLink key={j} href={child.url} {...rest}>
          {banner ??
            (child.icon ? (
              <div className='bg-fd-muted w-fit rounded-md border p-1 [&_svg]:size-4'>{child.icon}</div>
            ) : null)}
          <p className='-mb-1 text-sm font-medium'>{child.text}</p>
          {child.description ? <p className='text-fd-muted-foreground text-[13px]'>{child.description}</p> : null}
          {footer}
        </NavbarMenuLink>
      );
    });

    return (
      <NavbarMenu>
        <NavbarMenuTrigger {...props}>
          {item.url ? <Link href={item.url}>{item.text}</Link> : item.text}
        </NavbarMenuTrigger>
        <NavbarMenuContent>{children}</NavbarMenuContent>
      </NavbarMenu>
    );
  }

  return (
    <NavbarLink {...props} item={item} variant={item.type} aria-label={item.type === 'icon' ? item.label : undefined}>
      {item.type === 'icon' ? item.icon : item.text}
    </NavbarLink>
  );
}

function isSecondary(item: LinkItemType): boolean {
  return ('secondary' in item && item.secondary === true) || item.type === 'icon';
}
