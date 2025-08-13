import { HttpParams } from '@angular/common/http';

import { DataPaginationOptions, Filter } from '@app/models';

/**
 * Set HttpParams based on pagination options.
 */
export function setPaginationParams<T>(options: DataPaginationOptions<T>): HttpParams {
  let params = new HttpParams()
    .set('page', options.page.toString())
    .set('pageSize', options.pageSize.toString())
    .set('sortBy', options.sortBy.toString())
    .set('sortOrder', options.sortOrder);

  if (options.search.trim()) {
    params = params.set('search', options.search.trim());
  }

  if (Object.keys(options.filters).length) {
    Object.entries(options.filters).forEach(([key, filter]) => {
      params = params.set(`filter_${key}`, (filter as Filter).value.toString());
    });
  }

  return params;
}
