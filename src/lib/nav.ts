/**
 * Single source of truth for navigation. The same five tabs show at every
 * width, from phone to widescreen.
 */
export interface NavLink {
  href: string;
  label: string;
  hint: string;
  match: (pathname: string) => boolean;
}

export const NAV_LINKS: NavLink[] = [
  {
    href: '/',
    label: 'Home',
    hint: 'Now playing and latest renders',
    match: (p) => p === '/',
  },
  {
    href: '/comparisons',
    label: 'Projects',
    hint: 'Review and compare takes',
    match: (p) => p.startsWith('/comparisons'),
  },
  {
    href: '/prompts',
    label: 'Prompts',
    hint: 'Browse prompt recipes',
    match: (p) => p.startsWith('/prompts'),
  },
  {
    href: '/create',
    label: 'Create',
    hint: 'Pitch a new project',
    match: (p) => p.startsWith('/create'),
  },
  {
    href: '/sources',
    label: 'Sources',
    hint: 'Where the prompt library came from',
    match: (p) => p.startsWith('/sources'),
  },
];
