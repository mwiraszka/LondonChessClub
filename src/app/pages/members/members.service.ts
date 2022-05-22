import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from '@app/core/auth';

import { Member } from './types/member.model';
import { MembersApiResponse } from './types/members-api-response.model';
import { environment } from '@environments/environment';

const API_ENDPOINT = environment.cognito.membersEndpoint;
@Injectable({
  providedIn: 'root',
})
export class MembersService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  // WIP - finish once updateMember (below) is working
  getMember(id: string): Observable<Member | null> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.get<Member>(API_ENDPOINT, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      catchError(() => {
        console.error('[Members Service] Failed to fetch member from database.');
        return of(null);
      })
    );
  }

  getMembers(): Observable<Member[] | null> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.get<Member[]>(API_ENDPOINT, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      catchError(() => {
        console.error('[Members Service] Failed to fetch members from database.');
        return of(null);
      })
    );
  }

  addMember(memberToAdd: Member): Observable<any | null> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.post<MembersApiResponse>(API_ENDPOINT, memberToAdd, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      map(() => memberToAdd),
      catchError(() => {
        console.error('[Members Service] Failed to add member to database.');
        return of(null);
      })
    );
  }

  // WIP - currently results in 500 internal server error for some reason; doesn't seem
  // to reach Lambda since no logs for lcc-update-member in CloudWatch are showing up
  updateMember(memberToUpdate: Member): Observable<Member | null> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.put<any>(API_ENDPOINT + memberToUpdate.userId, memberToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      catchError(() => {
        console.error('[Members Service] Failed to update member.');
        return of(null);
      })
    );
  }

  // WIP - finish once updateMember (above) is working
  deleteMember(memberToDelete: Member): Observable<Member | null> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.delete<any>(API_ENDPOINT + memberToDelete.userId, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      catchError(() => {
        console.error('[Members Service] Failed to delete member from database.');
        return of(null);
      })
    );
  }
}
