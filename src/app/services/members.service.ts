import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Member, ServiceResponse } from '@app/types';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  readonly API_ENDPOINT = environment.cognito.membersEndpoint;

  constructor(private authService: AuthService, private http: HttpClient) {}

  getMember(id: string): Observable<ServiceResponse<Member>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.get<Member>(this.API_ENDPOINT + id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(member => ({ payload: member })),
      catchError(() => of({ error: new Error('Failed to fetch member from database') })),
    );
  }

  getMembers(isAdmin: boolean): Observable<ServiceResponse<Member[]>> {
    if (isAdmin) {
      return this.authService.token().pipe(
        switchMap(token =>
          this.http.get<Member[]>(this.API_ENDPOINT, {
            headers: new HttpHeaders({
              Authorization: token,
            }),
          }),
        ),
        map(members => ({ payload: members })),
        catchError(() =>
          of({ error: new Error('Failed to fetch members from database') }),
        ),
      );
    } else {
      return this.http.get<Member[]>(this.API_ENDPOINT + 'public/').pipe(
        map(members => ({ payload: members })),
        catchError(() =>
          of({ error: new Error('Failed to fetch members from database') }),
        ),
      );
    }
  }

  addMember(memberToAdd: Member): Observable<ServiceResponse<Member>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(this.API_ENDPOINT, memberToAdd, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: memberToAdd })),
      catchError(() => of({ error: new Error('Failed to add member to database') })),
    );
  }

  updateMember(memberToUpdate: Member): Observable<ServiceResponse<Member>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(this.API_ENDPOINT + memberToUpdate.id, memberToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: memberToUpdate })),
      catchError(() => of({ error: new Error('Failed to update member') })),
    );
  }

  deleteMember(memberToDelete: Member): Observable<ServiceResponse<Member>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<null>(this.API_ENDPOINT + memberToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: memberToDelete })),
      catchError(() => of({ error: new Error('Failed to delete member from database') })),
    );
  }
}
