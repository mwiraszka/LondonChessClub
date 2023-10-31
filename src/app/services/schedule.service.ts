import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ClubEvent, ServiceResponse } from '@app/types';
import { customSort } from '@app/utils';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  readonly API_ENDPOINT = environment.cognito.scheduleEndpoint;

  constructor(private authService: AuthService, private http: HttpClient) {}

  getEvent(id: string): Observable<ServiceResponse<ClubEvent>> {
    return this.http.get<ClubEvent>(this.API_ENDPOINT + id).pipe(
      map(event => ({ payload: event })),
      catchError(() => of({ error: new Error('Failed to fetch event from database') })),
    );
  }

  getEvents(): Observable<ServiceResponse<ClubEvent[]>> {
    return this.http.get<ClubEvent[]>(this.API_ENDPOINT).pipe(
      map(events => {
        const sortedEvents = [...events].sort(customSort('eventDate', true));
        return { payload: sortedEvents };
      }),
      catchError(() =>
        of({ error: new Error('Failed to fetch schedule from database') }),
      ),
    );
  }

  addEvent(eventToAdd: ClubEvent): Observable<ServiceResponse<ClubEvent>> {
    // Escaping the backslash for new lines seems necessary to work with API Gateway
    // integration mapping set up for this endpoint (not needed for updateEvent())
    eventToAdd = {
      ...eventToAdd,
      details: eventToAdd.details.replaceAll('\n', '\\n'),
    };

    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(this.API_ENDPOINT, eventToAdd, {
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
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(this.API_ENDPOINT + eventToUpdate.id, eventToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: eventToUpdate })),
      catchError(() => of({ error: new Error('Failed to update schedule') })),
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
}
