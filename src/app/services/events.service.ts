import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiResponse, DbCollection, Event, Id } from '@app/models';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'events';

  constructor(private readonly http: HttpClient) {}

  public getEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.API_BASE_URL}/${this.COLLECTION}`);
  }

  public getEvent(id: Id): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }

  public addEvent(event: Event): Observable<ApiResponse<Id>> {
    return this.http.post<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      event,
    );
  }

  public updateEvent(event: Event): Observable<ApiResponse<Id>> {
    return this.http.put<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${event.id}`,
      event,
    );
  }

  public deleteEvent(id: Id): Observable<ApiResponse<Id>> {
    return this.http.delete<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }
}
