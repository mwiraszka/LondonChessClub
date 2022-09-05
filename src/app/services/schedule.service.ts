import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ClubEvent, ServiceResponse } from '@app/types';
import { customSort } from '@app/utils';
import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

const API_ENDPOINT = environment.cognito.scheduleEndpoint;
@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getEvent(id: string): Observable<ServiceResponse> {
    return this.http.get<ClubEvent>(API_ENDPOINT + id).pipe(
      map((event) => ({ payload: { event } })),
      catchError(() => of({ error: new Error('Failed to fetch event from database') }))
    );
  }

  getEvents(): Observable<ServiceResponse> {
    return this.http.get<ClubEvent[]>(API_ENDPOINT).pipe(
      map((events) => {
        const sortedEvents = [...events].sort(customSort('eventDate', true));
        return { payload: { events: sortedEvents } };
      }),
      catchError(() => of({ error: new Error('Failed to fetch schedule from database') }))
    );
    // return of({ error: new Error('Schedule API call temporarily disabled') });
  }

  addEvent(eventToAdd: ClubEvent): Observable<ServiceResponse> {
    // Escaping the backslash for new lines seems necessary to work with API Gateway's
    // integration mapping used for this endpoint (not needed for updateEvent())
    eventToAdd = {
      ...eventToAdd,
      details: eventToAdd.details.replaceAll('\n', '\\n'),
    };

    return this.authService.token().pipe(
      switchMap((token) =>
        this.http.post<null>(API_ENDPOINT, eventToAdd, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      map(() => ({ payload: { event: eventToAdd } })),
      catchError(() => of({ error: new Error('Failed to add event to database') }))
    );
  }

  updateEvent(eventToUpdate: ClubEvent): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap((token) =>
        this.http.put<null>(API_ENDPOINT + eventToUpdate.id, eventToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      map(() => ({ payload: { event: eventToUpdate } })),
      catchError(() => of({ error: new Error('Failed to update schedule') }))
    );
  }

  deleteEvent(eventToDelete: ClubEvent): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap((token) =>
        this.http.delete<null>(API_ENDPOINT + eventToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      map(() => ({ payload: { event: eventToDelete } })),
      catchError(() => of({ error: new Error('Failed to delete event from database') }))
    );
  }
}
