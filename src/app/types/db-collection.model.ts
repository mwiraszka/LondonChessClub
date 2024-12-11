const dbCollections = ['articles', 'events', 'images', 'members'] as const;
export type DbCollection = (typeof dbCollections)[number];

export function isDbCollection(value: string): value is DbCollection {
  return dbCollections.indexOf(value as DbCollection) !== -1;
}
