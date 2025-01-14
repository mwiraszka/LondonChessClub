import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiResponse, DbCollection, Id, Image } from '@app/models';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'images';

  constructor(private readonly http: HttpClient) {}

  public getThumbnailImages(): Observable<ApiResponse<Image[]>> {
    return this.http.get<ApiResponse<Image[]>>(`${this.API_BASE_URL}/${this.COLLECTION}`);
  }

  public getImage(id: Id): Observable<ApiResponse<Image>> {
    return this.http.get<ApiResponse<Image>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }

  public addImage(imageFormData: FormData): Observable<ApiResponse<Image>> {
    return this.http.post<ApiResponse<Image>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      imageFormData,
    );
  }

  public deleteImage(id: Id): Observable<ApiResponse<Id>> {
    return this.http.delete<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }
}
