import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ClubEvent, Id } from '@app/types';
import { customSort } from '@app/utils';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  readonly EVENTS_ENDPOINT = environment.api.eventsEndpoint;

  constructor(private http: HttpClient) {}

  getEvent(id: string): Observable<ClubEvent> {
    return this.http.get<ClubEvent>(this.EVENTS_ENDPOINT + id);
  }

  getEvents(): Observable<ClubEvent[]> {
    return this.http.get<ClubEvent[]>(this.EVENTS_ENDPOINT);
  }

  addEvent(event: ClubEvent): Observable<ClubEvent> {
    return this.http
      .post<Id>(this.EVENTS_ENDPOINT, event)
      .pipe(map(id => ({ ...event, id })));
  }

  updateEvent(event: ClubEvent): Observable<ClubEvent> {
    return this.http
      .put<Id>(this.EVENTS_ENDPOINT + event.id, event)
      .pipe(map(() => event));
  }

  deleteEvent(event: ClubEvent): Observable<ClubEvent> {
    return this.http.delete<Id>(this.EVENTS_ENDPOINT + event.id).pipe(map(() => event));
  }
}
