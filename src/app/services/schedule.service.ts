import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ClubEvent, ServiceResponse } from '@app/types';
import { customSort } from '@app/utils';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  readonly API_ENDPOINT = environment.newEventsEndpoint;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  // TODO: Improve response typing & error handling
  getEvent(id: string): Observable<ServiceResponse<ClubEvent>> {
    return this.http.get<ClubEvent>(this.API_ENDPOINT + id).pipe(
      map(event => ({ payload: event })),
      catchError(() => of({ error: new Error('Failed to fetch event from database') })),
    );
  }

  getEvents(): Observable<ServiceResponse<ClubEvent[]>> {
    return this.http.get<{ events: ClubEvent[] }>(this.API_ENDPOINT).pipe(
      map(({ events }) => {
        const sortedEvents = [...events].sort(customSort('eventDate', false));
        return { payload: sortedEvents };
      }),
      catchError(() => of({ error: new Error('Failed to fetch events from database') })),
    );
  }

  addEvent(event: ClubEvent): Observable<ServiceResponse<ClubEvent>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(this.API_ENDPOINT, event, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: event })),
      catchError(error =>
        of({ error: new Error(`Failed to add event to database: \n${error}`) }),
      ),
    );
  }

  updateEvent(event: ClubEvent): Observable<ServiceResponse<ClubEvent>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(this.API_ENDPOINT + event.id, event, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: event })),
      catchError(error => of({ error: new Error(`Failed to update event: \n${error}`) })),
    );
  }

  deleteEvent(event: ClubEvent): Observable<ServiceResponse<ClubEvent>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<null>(this.API_ENDPOINT + event.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: event })),
      catchError(error =>
        of({ error: new Error(`Failed to delete event from database: \n${error}`) }),
      ),
    );
  }
}
