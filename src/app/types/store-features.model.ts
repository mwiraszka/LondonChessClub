const storeFeatures = ['app', 'articles', 'auth', 'events', 'members', 'nav'] as const;
export type StoreFeature = (typeof storeFeatures)[number];

export function isStoreFeature(value: unknown): value is StoreFeature {
  return storeFeatures.indexOf(value as StoreFeature) !== -1;
}