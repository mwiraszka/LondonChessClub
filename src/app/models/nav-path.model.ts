const navPaths = [
  '',
  'about',
  'album',
  'article',
  'change-password',
  'city-champion',
  'documents',
  'event',
  'game-archives',
  'image',
  'lifetime-achievement-awards',
  'login',
  'member',
  'members',
  'news',
  'photo-gallery',
  'schedule',
] as const;
export type NavPath = (typeof navPaths)[number];

export function isNavPath(value: unknown): value is NavPath {
  return navPaths.indexOf(value as NavPath) !== -1;
}
