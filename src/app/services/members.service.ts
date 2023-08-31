import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Member, ServiceResponse } from '@app/types';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

const API_ENDPOINT = environment.cognito.membersEndpoint;
@Injectable({
  providedIn: 'root',
})
export class MembersService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getMember(id: string): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.get<Member>(API_ENDPOINT + id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(member => ({ payload: { member } })),
      catchError(() => of({ error: new Error('Failed to fetch member from database') })),
    );
  }

  getMembers(isAdmin: boolean): Observable<ServiceResponse> {
    if (isAdmin) {
      return this.authService.token().pipe(
        switchMap(token =>
          this.http.get<Member[]>(API_ENDPOINT, {
            headers: new HttpHeaders({
              Authorization: token,
            }),
          }),
        ),
        map(members => ({ payload: { members } })),
        catchError(() =>
          of({ error: new Error('Failed to fetch members from database') }),
        ),
      );
    } else {
      return this.http.get<Member[]>(API_ENDPOINT + 'public/').pipe(
        map(members => ({ payload: { members } })),
        catchError(() =>
          of({ error: new Error('Failed to fetch members from database') }),
        ),
      );
    }
  }

  addMember(memberToAdd: Member): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(API_ENDPOINT, memberToAdd, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: { member: memberToAdd } })),
      catchError(() => of({ error: new Error('Failed to add member to database') })),
    );
  }

  updateMember(memberToUpdate: Member): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(API_ENDPOINT + memberToUpdate.id, memberToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: { member: memberToUpdate } })),
      catchError(() => of({ error: new Error('Failed to update member') })),
    );
  }

  deleteMember(memberToDelete: Member): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<null>(API_ENDPOINT + memberToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: { member: memberToDelete } })),
      catchError(() => of({ error: new Error('Failed to delete member from database') })),
    );
  }
}
