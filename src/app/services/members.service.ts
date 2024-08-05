/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { FlatMember, Member, ServiceResponse } from '@app/types';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  readonly PUBLIC_API_ENDPOINT = environment.aws.membersPublicEndpoint;
  readonly PRIVATE_API_ENDPOINT = environment.aws.membersPrivateEndpoint;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  getMember(id: string): Observable<ServiceResponse<Member>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.get<FlatMember>(this.PRIVATE_API_ENDPOINT + id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(member => ({ payload: this.adaptForFrontend([member])[0] })),
      catchError(error =>
        of({ error: new Error(`Failed to fetch member from database: \n${error}`) }),
      ),
    );
  }

  getMembers(isAdmin: boolean): Observable<ServiceResponse<Member[]>> {
    if (isAdmin) {
      return this.authService.token().pipe(
        switchMap(token =>
          this.http.get<FlatMember[]>(this.PRIVATE_API_ENDPOINT, {
            headers: new HttpHeaders({
              Authorization: token,
            }),
          }),
        ),
        map(members => ({ payload: this.adaptForFrontend(members) })),
        catchError(error =>
          of({ error: new Error(`Failed to fetch members from database: \n${error}`) }),
        ),
      );
    } else {
      return this.http.get<FlatMember[]>(this.PUBLIC_API_ENDPOINT).pipe(
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
        this.http.post<null>(this.PRIVATE_API_ENDPOINT, flattenedMember, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: memberToAdd })),
      catchError(error =>
        of({ error: new Error(`Failed to add member to database: \n${error}`) }),
      ),
    );
  }

  updateMember(memberToUpdate: Member): Observable<ServiceResponse<Member>> {
    const flattenedMember = this.adaptForBackend([memberToUpdate])[0];

    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(
          this.PRIVATE_API_ENDPOINT + flattenedMember.id,
          flattenedMember,
          {
            headers: new HttpHeaders({
              Authorization: token,
            }),
          },
        ),
      ),
      map(() => ({ payload: memberToUpdate })),
      catchError(error =>
        of({ error: new Error(`Failed to update member: \n${error}`) }),
      ),
    );
  }

  deleteMember(memberToDelete: Member): Observable<ServiceResponse<Member>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<null>(this.PRIVATE_API_ENDPOINT + memberToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: memberToDelete })),
      catchError(error =>
        of({ error: new Error(`Failed to delete member from database: \n${error}`) }),
      ),
    );
  }

  private adaptForFrontend(members: FlatMember[]): Member[] {
    return members.map(member => {
      return {
        id: member.id,
        firstName: member.firstName!,
        lastName: member.lastName!,
        city: member.city,
        rating: member.rating,
        peakRating: member.peakRating,
        dateJoined: member.dateJoined,
        isActive: member.isActive!,
        email: member.email ?? null,
        phoneNumber: member.phoneNumber ?? null,
        yearOfBirth: member.yearOfBirth ?? null,
        chesscomUsername: member.chesscomUsername ?? null,
        lichessUsername: member.lichessUsername ?? null,
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
        firstName: member.firstName!,
        lastName: member.lastName!,
        city: member.city,
        rating: member.rating,
        peakRating: this.getNewPeakRating(member.rating, member.peakRating),
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

  private getNewPeakRating(rating: string, peakRating: string): string {
    const ratingNum = +rating.split('/')[0];
    const peakRatingNum = +peakRating.split('/')[0];

    const surpassedCurrentPeakRating = ratingNum > peakRatingNum;
    const firstNonProvisionalRating = !rating.includes('/') && peakRating.includes('/');

    return surpassedCurrentPeakRating || firstNonProvisionalRating ? rating : peakRating;
  }
}
