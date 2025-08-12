import { EntityType } from './entity.model';

export interface Filter {
  label: string;
  value: boolean;
}

export interface FiltersRecord {
  [key: string]: Filter;
}

export type PageSize = 10 | 20 | 50 | 100;

export interface DataDisplayOptions<T = EntityType> {
  filters: Record<string, Filter>;
  isAscending: boolean;
  pageNum: number;
  pageSize: PageSize;
  searchQuery: string;
  sortedBy: keyof T;
  filteredTotal: number;
}
