import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiResponse, DbCollection, Id, Image } from '@app/models';
import { BaseImage } from '@app/models/image.model';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'images';

  constructor(private readonly http: HttpClient) {}

  public getAllImagesMetadata(): Observable<ApiResponse<BaseImage[]>> {
    return this.http.get<ApiResponse<BaseImage[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/all-metadata`,
    );
  }

  public getAllThumbnailImages(): Observable<ApiResponse<Image[]>> {
    return this.http.get<ApiResponse<Image[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/all-thumbnails`,
    );
  }

  public getBatchThumbnailImages(ids: Id[]): Observable<ApiResponse<Image[]>> {
    return this.http.get<ApiResponse<Image[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/batch-thumbnails`,
      { params: { ids: ids.join(',') } },
    );
  }

  public getOriginalImage(id: Id, isPrefetch = false): Observable<ApiResponse<Image>> {
    const url = `${this.API_BASE_URL}/${this.COLLECTION}/${id}`;

    if (isPrefetch) {
      // Use Fetch API with keepalive to prevent browser cancellation when image is not in viewport
      return new Observable(observer => {
        fetch(url, { method: 'GET', keepalive: true, credentials: 'include' })
          .then(response => {
            if (!response.ok) {
              throw new Error(
                `[LCC] HTTP error during prefetch! Status: ${response.status}`,
              );
            }
            return response.json();
          })
          .then(data => {
            observer.next(data);
            observer.complete();
          })
          .catch(error => {
            console.error(`[LCC] Error prefetching image ${id}:`, error);
            observer.error(error);
          });
      });
    }

    // Use standard HttpClient if keepalive is not requested
    return this.http.get<ApiResponse<Image>>(url);
  }

  public addImages(imagesFormData: FormData): Observable<ApiResponse<Image[]>> {
    return this.http.post<ApiResponse<Image[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      imagesFormData,
    );
  }

  public updateImages(baseImages: BaseImage[]): Observable<ApiResponse<Id[]>> {
    return this.http.put<ApiResponse<Id[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      baseImages,
    );
  }

  public deleteImage(id: Id): Observable<ApiResponse<Id>> {
    return this.http.delete<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }

  public deleteAlbum(album: string): Observable<ApiResponse<Id[]>> {
    return this.http.delete<ApiResponse<Id[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/album/${encodeURIComponent(album)}`,
    );
  }
}
