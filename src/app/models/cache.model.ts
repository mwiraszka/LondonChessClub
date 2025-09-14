import { IsoDate } from './core.model';

export interface CacheMetadata {
  lastFetch: IsoDate | null;
  isStale: boolean;
}

export type CacheInvalidationStrategy = 'immediate' | 'background' | 'manual';
