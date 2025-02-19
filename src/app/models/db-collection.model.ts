const dbCollections = ['articles', 'events', 'images', 'members', 'users'] as const;
export type DbCollection = (typeof dbCollections)[number];

export function isDbCollection(value: unknown): value is DbCollection {
  return dbCollections.indexOf(value as DbCollection) !== -1;
}
