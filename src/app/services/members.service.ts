import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, DbCollection, Id, Member } from '@app/types';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'members';

  constructor(private readonly http: HttpClient) {}

  public getMembers(scope: ApiScope): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`);
  }

  public getMember(scope: ApiScope, id: Id): Observable<Member> {
    return this.http.get<Member>(
      `${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${id}`,
    );
  }

  public addMember(member: Member): Observable<Member> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`, member)
      .pipe(map(id => ({ ...member, id })));
  }

  public updateMember(member: Member): Observable<Member> {
    const scope: ApiScope = 'admin';
    return this.http
      .put<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${member.id}`, member)
      .pipe(map(() => member));
  }

  public deleteMember(member: Member): Observable<Member> {
    const scope: ApiScope = 'admin';
    return this.http
      .delete<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${member.id}`)
      .pipe(map(() => member));
  }
}
