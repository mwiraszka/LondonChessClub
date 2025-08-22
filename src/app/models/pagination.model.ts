import { EntityType } from './entity.model';

export interface Filter {
  label: string;
  value: boolean;
}

export interface DataPaginationOptions<T = EntityType> {
  page: number;
  pageSize: number;
  sortBy: keyof T;
  sortOrder: 'asc' | 'desc';
  filters: Partial<NonNullable<Record<keyof T, Filter>>>;
  search: string;
}
