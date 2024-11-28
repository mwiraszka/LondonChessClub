import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ClubEvent, Id } from '@app/types';
import { customSort } from '@app/utils';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  readonly EVENTS_ENDPOINT = environment.api.eventsEndpoint;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  getEvent(id: string): Observable<ClubEvent> {
    return this.http.get<ClubEvent>(this.EVENTS_ENDPOINT + id);
  }

  getEvents(): Observable<ClubEvent[]> {
    return this.http
      .get<ClubEvent[]>(this.EVENTS_ENDPOINT)
      .pipe(map(events => [...events].sort(customSort('eventDate', false))));
  }

  addEvent(event: ClubEvent): Observable<ClubEvent> {
    return this.http
      .post<Id>(this.EVENTS_ENDPOINT, event)
      .pipe(map(id => ({ ...event, id })));
  }

  updateEvent(event: ClubEvent): Observable<ClubEvent> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<Id>(this.EVENTS_ENDPOINT + event.id, event, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => event),
    );
  }

  deleteEvent(event: ClubEvent): Observable<ClubEvent> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<Id>(this.EVENTS_ENDPOINT + event.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => event),
    );
  }
}
