import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  ApiResponse,
  ApiScope,
  DataPaginationOptions,
  DbCollection,
  Id,
  Member,
  PaginatedItems,
} from '@app/models';
import { setPaginationParams } from '@app/utils';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class MembersApiService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'members';

  constructor(private readonly http: HttpClient) {}

  public getAllMembers(
    isAdmin: boolean,
  ): Observable<ApiResponse<PaginatedItems<Member>>> {
    const scope: ApiScope = isAdmin ? 'admin' : 'public';

    return this.http.get<ApiResponse<PaginatedItems<Member>>>(
      `${this.API_BASE_URL}/${scope}/${this.COLLECTION}`,
    );
  }

  public getFilteredMembers(
    isAdmin: boolean,
    options: DataPaginationOptions<Member>,
  ): Observable<ApiResponse<PaginatedItems<Member>>> {
    const scope: ApiScope = isAdmin ? 'admin' : 'public';
    const params = setPaginationParams(options);

    return this.http.get<ApiResponse<PaginatedItems<Member>>>(
      `${this.API_BASE_URL}/${scope}/${this.COLLECTION}`,
      { params },
    );
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

  public updateMembers(members: Member[]): Observable<ApiResponse<Member[]>> {
    return this.http.put<ApiResponse<Member[]>>(
      `${this.API_BASE_URL}/admin/${this.COLLECTION}`,
      members,
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
