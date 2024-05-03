/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ClubEvent, FlatClubEvent, ServiceResponse } from '@app/types';
import { customSort } from '@app/utils';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  readonly API_ENDPOINT = environment.aws.scheduleEndpoint;

  constructor(private authService: AuthService, private http: HttpClient) {}

  getEvent(id: string): Observable<ServiceResponse<ClubEvent>> {
    return this.http.get<FlatClubEvent>(this.API_ENDPOINT + id).pipe(
      map(event => ({ payload: this.adaptForFrontend([event])[0] })),
      catchError(() => of({ error: new Error('Failed to fetch event from database') })),
    );
  }

  getEvents(): Observable<ServiceResponse<ClubEvent[]>> {
    return this.http.get<FlatClubEvent[]>(this.API_ENDPOINT).pipe(
      map(events => {
        const adaptedEvents = this.adaptForFrontend(events);
        const sortedEvents = [...adaptedEvents].sort(customSort('eventDate', false));
        return { payload: sortedEvents };
      }),
      catchError(() => of({ error: new Error('Failed to fetch events from database') })),
    );
  }

  addEvent(eventToAdd: ClubEvent): Observable<ServiceResponse<ClubEvent>> {
    const flattenedEvent = this.adaptForBackend([eventToAdd])[0];
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(this.API_ENDPOINT, flattenedEvent, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: eventToAdd })),
      catchError(() => of({ error: new Error('Failed to add event to database') })),
    );
  }

  updateEvent(eventToUpdate: ClubEvent): Observable<ServiceResponse<ClubEvent>> {
    const flattenedEvent = this.adaptForBackend([eventToUpdate])[0];
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(this.API_ENDPOINT + eventToUpdate.id, flattenedEvent, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: eventToUpdate })),
      catchError(() => of({ error: new Error('Failed to update event') })),
    );
  }

  deleteEvent(eventToDelete: ClubEvent): Observable<ServiceResponse<ClubEvent>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<null>(this.API_ENDPOINT + eventToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: eventToDelete })),
      catchError(() => of({ error: new Error('Failed to delete event from database') })),
    );
  }

  private adaptForFrontend(events: FlatClubEvent[]): ClubEvent[] {
    return events.map(event => {
      return {
        id: event.id,
        eventDate: event.eventDate,
        title: event.title,
        details: event.details,
        type: event.type,
        associatedArticleId: event.associatedArticleId,
        modificationInfo: {
          dateCreated: new Date(event.dateCreated),
          createdBy: event.createdBy,
          dateLastEdited: new Date(event.dateLastEdited),
          lastEditedBy: event.lastEditedBy,
        },
      };
    });
  }

  private adaptForBackend(events: ClubEvent[]): FlatClubEvent[] {
    return events.map(event => {
      return {
        id: event.id,
        eventDate: event.eventDate,
        title: event.title,
        details: event.details,
        type: event.type,
        associatedArticleId: event.associatedArticleId,
        dateCreated: event.modificationInfo!.dateCreated.toISOString(),
        createdBy: event.modificationInfo!.createdBy,
        dateLastEdited: event.modificationInfo!.dateLastEdited.toISOString(),
        lastEditedBy: event.modificationInfo!.lastEditedBy,
      };
    });
  }
}
