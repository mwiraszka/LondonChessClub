import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, DbCollection, Event, Id } from '@app/types';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  readonly API_URL = environment.lccApiUrl;
  readonly COLLECTION: DbCollection = 'events';

  constructor(private http: HttpClient) {}

  getEvent(id: Id): Observable<Event> {
    const scope: ApiScope = 'public';
    return this.http.get<Event>(`${this.API_URL}/${scope}/${this.COLLECTION}/${id}`);
  }

  getEvents(): Observable<Event[]> {
    const scope: ApiScope = 'public';
    return this.http.get<Event[]>(`${this.API_URL}/${scope}/${this.COLLECTION}`);
  }

  addEvent(event: Event): Observable<Event> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}`, event)
      .pipe(map(id => ({ ...event, id })));
  }

  updateEvent(event: Event): Observable<Event> {
    const scope: ApiScope = 'admin';
    return this.http
      .put<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}/${event.id}`, event)
      .pipe(map(() => event));
  }

  deleteEvent(event: Event): Observable<Event> {
    const scope: ApiScope = 'admin';
    return this.http
      .delete<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}/${event.id}`)
      .pipe(map(() => event));
  }
}
