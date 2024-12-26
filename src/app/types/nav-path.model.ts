const navPaths = [
  '',
  'about',
  'members',
  'member',
  'schedule',
  'event',
  'news',
  'article',
  'city-champion',
  'photo-gallery',
  'game-archives',
  'documents',
  'login',
  'logout',
  'change-password',
] as const;
export type NavPath = (typeof navPaths)[number];

export function isNavPath(value: unknown): value is NavPath {
  return navPaths.indexOf(value as NavPath) !== -1;
}