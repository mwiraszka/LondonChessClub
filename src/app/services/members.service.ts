import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type {
  ApiResponse,
  ApiScope,
  CollectionDisplayOptions,
  DbCollection,
  Id,
  Member,
} from '@app/models';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'members';

  constructor(private readonly http: HttpClient) {}

  public getMembers(
    scope: ApiScope,
    options: CollectionDisplayOptions<Member>,
  ): Observable<
    ApiResponse<{ items: Member[]; total: number; totalMemberCount: number }>
  > {
    let params = new HttpParams();

    if (options?.pageNum) {
      params = params.set('page', options.pageNum.toString());
    }

    if (options?.pageSize) {
      params = params.set('pageSize', options.pageSize.toString());
    }

    if (options?.sortedBy) {
      params = params.set('sortBy', options.sortedBy);
    }

    if (options?.isAscending) {
      params = params.set('sortOrder', options.isAscending ? 'asc' : 'desc');
    }

    if (!isEmpty(options?.searchQuery)) {
      params = params.set('search', options.searchQuery.trim());
    }

    if (options?.filters && options.filters.length > 0) {
      options.filters.forEach(filter => {
        if (filter.value) {
          // Only add filters that are enabled (value = true)
          params = params.set(`filter_${filter.key}`, filter.value.toString());
        }
      });
    }

    return this.http.get<
      ApiResponse<{ items: Member[]; total: number; totalMemberCount: number }>
    >(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`, { params });
  }

  public getMember(id: Id): Observable<ApiResponse<Member>> {
    return this.http.get<ApiResponse<Member>>(
      `${this.API_BASE_URL}/admin/${this.COLLECTION}/${id}`,
    );
  }

  public addMember(member: Member): Observable<ApiResponse<Id>> {
    return this.http.post<ApiResponse<Id>>(
      `${this.API_BASE_URL}/admin/${this.COLLECTION}`,
      member,
    );
  }

  public updateMember(member: Member): Observable<ApiResponse<Id>> {
    return this.http.put<ApiResponse<Id>>(
      `${this.API_BASE_URL}/admin/${this.COLLECTION}/${member.id}`,
      member,
    );
  }

  public deleteMember(id: Id): Observable<ApiResponse<Id>> {
    return this.http.delete<ApiResponse<Id>>(
      `${this.API_BASE_URL}/admin/${this.COLLECTION}/${id}`,
    );
  }
}
