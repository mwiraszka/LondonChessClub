import { EntityType } from './entity.model';
import { Filter } from './filter.model';

export interface CollectionDisplayOptions<T = EntityType> {
  filters: Filter[];
  isAscending: boolean;
  pageNum: number;
  pageSize: number;
  searchQuery: string;
  sortedBy: keyof T;
  totalItems: number;
}
