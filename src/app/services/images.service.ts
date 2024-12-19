import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, DbCollection, Id, Image } from '@app/types';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  readonly API_BASE_URL = environment.lccApiBaseUrl;
  readonly COLLECTION: DbCollection = 'images';

  constructor(private http: HttpClient) {}

  public getThumbnailImages(): Observable<Image[]> {
    const scope: ApiScope = 'public';
    return this.http.get<Image[]>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`);
  }

  public getImage(id: Id): Observable<Image> {
    const scope: ApiScope = 'public';
    return this.http.get<Image>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${id}`);
  }

  public addImage(image: Image): Observable<Image> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`, image)
      .pipe(map(id => ({ ...image, id })));
  }

  public deleteImage(id: Id): Observable<Id> {
    const scope: ApiScope = 'admin';
    return this.http.delete<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${id}`);
  }
}
