import { EntityType } from './entity.model';

export interface Filter {
  label: string;
  value: boolean;
}

export interface FiltersRecord {
  [key: string]: Filter;
}

export type PageSize = 10 | 20 | 50 | 100;

export interface DataPaginationOptions<T = EntityType> {
  page: number;
  pageSize: PageSize;
  sortBy: keyof T;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, Filter>;
  search: string;
}
