/**
 * Single source of truth for navigation, shared by the desktop top bar and the
 * mobile tab bar so the two surfaces can never drift apart.
 */
export interface NavLink {
  href: string;
  label: string;
  /** Shorter label for the tab bar, where width is scarce. */
  short?: string;
  hint: string;
  icon: string;
  match: (pathname: string) => boolean;
}

export const NAV_LINKS: NavLink[] = [
  {
    href: '/',
    label: 'Home',
    hint: 'Dashboard and latest media',
    icon: 'home',
    match: (p) => p === '/',
  },
  {
    href: '/prompts',
    label: 'Library',
    hint: 'Browse prompt cards',
    icon: 'library',
    match: (p) => p.startsWith('/prompts'),
  },
  {
    href: '/create',
    label: 'Create',
    hint: 'Start a new prompt project',
    icon: 'create',
    match: (p) => p.startsWith('/create'),
  },
  {
    href: '/comparisons',
    label: 'Projects',
    hint: 'Compare runs and outputs',
    icon: 'projects',
    match: (p) => p.startsWith('/comparisons'),
  },
];

/** Four destinations flank the centred Create tab; the rest live in "More". */
const TAB_HREFS = ['/', '/prompts', '/create', '/comparisons'];

export const TAB_LINKS: NavLink[] = TAB_HREFS.map(
  (href) => NAV_LINKS.find((link) => link.href === href)!,
);

export const MORE_LINKS: NavLink[] = NAV_LINKS.filter(
  (link) => !TAB_HREFS.includes(link.href),
);

/** True when the current route lives behind the "More" tab. */
export function isMoreActive(pathname: string): boolean {
  return MORE_LINKS.some((link) => link.match(pathname));
}
