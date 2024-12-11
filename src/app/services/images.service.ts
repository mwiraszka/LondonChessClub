import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, DbCollection, Id, Image, Url } from '@app/types';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  readonly API_URL = environment.lccApiUrl;
  readonly COLLECTION: DbCollection = 'images';

  constructor(private http: HttpClient) {}

  public getImages(): Observable<Image[]> {
    const scope: ApiScope = 'public';
    return this.http.get<Image[]>(`${this.API_URL}/${scope}/${this.COLLECTION}`);
  }

  public getImage(id: Id): Observable<Image> {
    const scope: ApiScope = 'public';
    return this.http.get<Image>(`${this.API_URL}/${scope}/${this.COLLECTION}/${id}`);
  }

  public addImage(image: Image): Observable<Image> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}`, image)
      .pipe(map(id => ({ ...image, id })));
  }

  public deleteImage(id: Id): Observable<Id> {
    const scope: ApiScope = 'admin';
    return this.http.delete<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}/${id}`);
  }

  public async getImageFile(imageUrl: Url): Promise<File> {
    const response = await fetch(imageUrl);
    const data = await response.blob();
    return new File([data], 'lcc-file', {
      type: data.type ?? 'image/jpeg',
    });
  }
}
