import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Member } from './types/member.model';
import { MembersApiResponse } from './types/members-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  constructor(private http: HttpClient) {}

  getMember(id: string): Observable<Member | null> {
    return this.http
      .get<MembersApiResponse>('http://localhost:3000/api/members' + id)
      .pipe(
        map((response) => response.payload.member),
        catchError(() => {
          console.error('[Members Service] Failed to retrieve member from database.');
          return of(null);
        })
      );
  }

  getMembers(): Observable<Member[] | null> {
    return this.http.get<MembersApiResponse>('http://localhost:3000/api/members').pipe(
      map((response) => response.payload.allMembers),
      catchError(() => {
        console.error('[Members Service] Failed to retrieve members from database.');
        return of(null);
      })
    );
  }

  addMember(memberToAdd: Member): Observable<Member | null> {
    return this.http
      .post<MembersApiResponse>('http://localhost:3000/api/members', memberToAdd)
      .pipe(
        map((response) => response.payload.addedMember),
        catchError(() => {
          console.error(
            `[Members Service] Failed to add ${memberToAdd.firstName} ${memberToAdd.lastName}
            to database.`
          );
          return of(null);
        })
      );
  }

  updateMember(memberToUpdate: Member): Observable<Member | null> {
    return this.http
      .put<MembersApiResponse>(
        'http://localhost:3000/api/members/' + memberToUpdate._id,
        memberToUpdate
      )
      .pipe(
        map((response) => response.payload.member),
        catchError(() => {
          console.error(
            `[Members Service] Failed to update ${memberToUpdate.firstName} ${memberToUpdate.lastName}
            in database.`
          );
          return of(null);
        })
      );
  }

  deleteMember(memberToDelete: Member): Observable<Member | null> {
    return this.http
      .delete<MembersApiResponse>(
        'http://localhost:3000/api/members/' + memberToDelete._id
      )
      .pipe(
        map(() => memberToDelete),
        catchError(() => {
          console.error(
            `[Members Service] Failed to delete ${memberToDelete.firstName} ${memberToDelete.lastName}
            from database.`
          );
          return of(null);
        })
      );
  }
}
