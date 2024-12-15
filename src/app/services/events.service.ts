import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, DbCollection, Event, Id } from '@app/types';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  readonly API_BASE_URL = environment.lccApiBaseUrl;
  readonly COLLECTION: DbCollection = 'events';

  constructor(private http: HttpClient) {}

  public getEvents(): Observable<Event[]> {
    const scope: ApiScope = 'public';
    return this.http.get<Event[]>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`);
  }

  public getEvent(id: Id): Observable<Event> {
    const scope: ApiScope = 'public';
    return this.http.get<Event>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${id}`);
  }

  public addEvent(event: Event): Observable<Event> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`, event)
      .pipe(map(id => ({ ...event, id })));
  }

  public updateEvent(event: Event): Observable<Event> {
    const scope: ApiScope = 'admin';
    return this.http
      .put<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${event.id}`, event)
      .pipe(map(() => event));
  }

  public deleteEvent(event: Event): Observable<Event> {
    const scope: ApiScope = 'admin';
    return this.http
      .delete<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${event.id}`)
      .pipe(map(() => event));
  }
}
