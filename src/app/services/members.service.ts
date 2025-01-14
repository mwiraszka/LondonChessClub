import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiResponse, ApiScope, DbCollection, Id, Member } from '@app/models';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'members';

  constructor(private readonly http: HttpClient) {}

  public getMembers(scope: ApiScope): Observable<ApiResponse<Member[]>> {
    return this.http.get<ApiResponse<Member[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      {
        params: {
          scope,
        },
      },
    );
  }

  public getMember(scope: ApiScope, id: Id): Observable<ApiResponse<Member>> {
    return this.http.get<ApiResponse<Member>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
      { params: { scope } },
    );
  }

  public addMember(member: Member): Observable<ApiResponse<Id>> {
    return this.http.post<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      member,
    );
  }

  public updateMember(member: Member): Observable<ApiResponse<Id>> {
    return this.http.put<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${member.id}`,
      member,
    );
  }

  public deleteMember(member: Member): Observable<ApiResponse<Id>> {
    return this.http.delete<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${member.id}`,
    );
  }
}
