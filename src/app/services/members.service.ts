/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FlatMember, Member, ServiceResponse } from '@app/types';

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
        this.http.get<FlatMember>(this.API_ENDPOINT + id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(member => ({ payload: this.adaptForFrontend([member])[0] })),
      catchError(() => of({ error: new Error('Failed to fetch member from database') })),
    );
  }

  getMembers(isAdmin: boolean): Observable<ServiceResponse<Member[]>> {
    if (isAdmin) {
      return this.authService.token().pipe(
        switchMap(token =>
          this.http.get<FlatMember[]>(this.API_ENDPOINT, {
            headers: new HttpHeaders({
              Authorization: token,
            }),
          }),
        ),
        map(members => ({ payload: this.adaptForFrontend(members) })),
        catchError(() =>
          of({ error: new Error('Failed to fetch members from database') }),
        ),
      );
    } else {
      return this.http.get<FlatMember[]>(this.API_ENDPOINT + 'public/').pipe(
        map(members => ({ payload: this.adaptForFrontend(members) })),
        catchError(() =>
          of({ error: new Error('Failed to fetch members from database') }),
        ),
      );
    }
  }

  addMember(memberToAdd: Member): Observable<ServiceResponse<Member>> {
    const flattenedMember = this.adaptForBackend([memberToAdd])[0];

    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(this.API_ENDPOINT, flattenedMember, {
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
    const flattenedMember = this.adaptForBackend([memberToUpdate])[0];

    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(this.API_ENDPOINT + flattenedMember.id, flattenedMember, {
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

  private adaptForFrontend(members: FlatMember[]): Member[] {
    return members.map(member => {
      return {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        city: member.city,
        rating: member.rating,
        peakRating: member.peakRating,
        dateJoined: member.dateJoined,
        isActive: member.isActive,
        email: member.email,
        phoneNumber: member.phoneNumber,
        yearOfBirth: member.yearOfBirth,
        chesscomUsername: member.chesscomUsername,
        lichessUsername: member.lichessUsername,
        modificationInfo: {
          dateCreated: new Date(
            member.dateCreated === '2023-01-01T00:00:00.000Z'
              ? '2023-01-01T05:00:00.000Z'
              : member.dateCreated,
          ),
          createdBy: member.createdBy,
          dateLastEdited: new Date(
            member.dateLastEdited === '2023-01-01T00:00:00.000Z'
              ? '2023-01-01T05:00:00.000Z'
              : member.dateLastEdited,
          ),
          lastEditedBy: member.lastEditedBy,
        },
      };
    });
  }

  private adaptForBackend(members: Member[]): FlatMember[] {
    return members.map(member => {
      return {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        city: member.city,
        rating: member.rating,
        peakRating: this.getNewPeakRating(member),
        dateJoined: member.dateJoined,
        isActive: member.isActive,
        email: member.email ?? '',
        phoneNumber: member.phoneNumber ?? '',
        yearOfBirth: member.yearOfBirth ?? '',
        chesscomUsername: member.chesscomUsername ?? '',
        lichessUsername: member.lichessUsername ?? '',
        dateCreated: member.modificationInfo!.dateCreated.toISOString(),
        createdBy: member.modificationInfo!.createdBy,
        dateLastEdited: member.modificationInfo!.dateLastEdited.toISOString(),
        lastEditedBy: member.modificationInfo!.lastEditedBy,
      };
    });
  }

  private getNewPeakRating(member: Member): string {
    if (member.rating.includes('/')) {
      return '(provisional)';
    }

    if (member.peakRating === '(provisional)' || +member.rating > +member.peakRating) {
      return member.rating;
    }

    return member.peakRating;
  }
}
