import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, DbCollection, Id, Member } from '@app/types';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  readonly API_URL = environment.lccApiUrl;
  readonly COLLECTION: DbCollection = 'members';

  constructor(private http: HttpClient) {}

  getMember(scope: ApiScope, id: Id): Observable<Member> {
    return this.http.get<Member>(`${this.API_URL}/${scope}/${this.COLLECTION}/${id}`);
  }

  getMembers(scope: ApiScope): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.API_URL}/${scope}/${this.COLLECTION}`);
  }

  addMember(member: Member): Observable<Member> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}`, member)
      .pipe(map(id => ({ ...member, id })));
  }

  updateMember(member: Member): Observable<Member> {
    const scope: ApiScope = 'admin';
    return this.http
      .put<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}/${member.id}`, member)
      .pipe(map(() => member));
  }

  deleteMember(member: Member): Observable<Member> {
    const scope: ApiScope = 'admin';
    return this.http
      .delete<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}/${member.id}`)
      .pipe(map(() => member));
  }
}
