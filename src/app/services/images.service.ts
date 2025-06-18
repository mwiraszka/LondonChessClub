import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiResponse, DbCollection, Id, Image } from '@app/models';
import { BaseImage } from '@app/models/image.model';

import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'images';

  constructor(private readonly http: HttpClient) {}

  public getThumbnailImages(): Observable<ApiResponse<Image[]>> {
    return this.http.get<ApiResponse<Image[]>>(`${this.API_BASE_URL}/${this.COLLECTION}`);
  }

  public getImagesForAlbum(album: string): Observable<ApiResponse<Image[]>> {
    return this.http.get<ApiResponse<Image[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/album/${album}`,
    );
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

  public updateImage(baseImage: BaseImage): Observable<ApiResponse<Id>> {
    return this.http.put<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${baseImage.id}`,
      baseImage,
    );
  }

  public deleteImage(id: Id): Observable<ApiResponse<Id>> {
    return this.http.delete<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }
}
