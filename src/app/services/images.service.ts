/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { Article, ServiceResponse, Url } from '@app/types';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  readonly API_ENDPOINT = environment.imagesEndpoint;

  constructor(private http: HttpClient) {}

  uploadArticleImage(article: Article): Observable<ServiceResponse<Article>> {
    const formData: FormData = new FormData();

    formData.append('imageFile', article.imageFile!);
    formData.append('imageId', article.imageId!);

    return this.http.post<ServiceResponse<void>>(this.API_ENDPOINT, formData).pipe(
      map(() => {
        return { payload: article };
      }),
      catchError(() => of({ error: new Error('Failed to store image in database') })),
    );
  }

  getArticleImageUrl(id: string): Observable<ServiceResponse<Url>> {
    return this.http
      .get<ServiceResponse<Url>>(this.API_ENDPOINT + id)
      .pipe(
        catchError(() => of({ error: new Error('Failed to get image presigned URL') })),
      );
  }

  deleteArticleImage(article: Article): Observable<ServiceResponse<Article>> {
    return this.http
      .delete<ServiceResponse<void>>(this.API_ENDPOINT + article.imageId)
      .pipe(
        map(() => {
          return { payload: article };
        }),
        catchError(() =>
          of({ error: new Error('Failed to delete image from database') }),
        ),
      );
  }
}
