import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getArticleThumbnailImageUrls(
    articles: Article[],
  ): Observable<ServiceResponse<Article[]>> {
    // TODO: Implement an article image endpoint for fetching multiple image urls in a single call
    return of(articles).pipe(
      switchMap(articles => {
        const articlesWithThumbnailImageUrl$: Observable<Article>[] = [];

        articles.forEach(article => {
          if (!article.imageId) {
            throw new Error('Article has no banner image ID');
          }

          const thumbnailImageId = `${article.imageId}-600x400`;
          const updatedArticle$ = this.getArticleImageUrl(thumbnailImageId).pipe(
            map(response => {
              if (!response.payload) {
                throw new Error(
                  'Unable to get a presigned URL for all article thumbnails',
                );
              }
              return { ...article, thumbnailImageUrl: response.payload };
            }),
          );
          articlesWithThumbnailImageUrl$.push(updatedArticle$);
        });

        return forkJoin(articlesWithThumbnailImageUrl$);
      }),
      map(articles => {
        return { payload: articles };
      }),
    );
  }

  sendPreflightRequest(imageId: string): Observable<string> {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'ContentType: text',
      'Access-Control-Max-Age': '86400',
    });

    return this.http.options(this.API_ENDPOINT + imageId, {
      headers,
      responseType: 'text',
    });
  }

  getArticleImageUrl(imageId?: string): Observable<ServiceResponse<Url>> {
    if (!imageId) {
      return of({
        error: new Error('No image ID and could not find image URL in local storage'),
      });
    }

    return this.sendPreflightRequest(imageId).pipe(
      switchMap(() => {
        return this.http
          .get<ServiceResponse<Url>>(this.API_ENDPOINT + imageId)
          .pipe(
            catchError(() =>
              of({ error: new Error('Failed to get image presigned URL') }),
            ),
          );
      }),
      catchError(() =>
        of({
          error: new Error('Failed while attempting to send preflight request'),
        }),
      ),
    );
  }

  getArticleImageFile(imageUrl: Url): Observable<ServiceResponse<File>> {
    return from(this.buildImageFileFromUrl(imageUrl)).pipe(
      map(imageFile => {
        return { payload: imageFile };
      }),
      catchError(() =>
        of({
          error: new Error(
            'Failed to build file from URL. If running locally, ensure browser CORS extention is enabled.',
          ),
        }),
      ),
    );
  }

  private async buildImageFileFromUrl(url: Url): Promise<File> {
    const response = await fetch(url);
    const data = await response.blob();
    const imageFile = new File([data], 'lcc-file', {
      type: data.type ?? 'image/jpeg',
    });

    if (!response || !data || !imageFile) {
      console.error('[LCC Error] Unable to build the image file from the given URL');
      console.error('[LCC Error] URL response:', response);
      console.error('[LCC Error] Data as blob:', data);
      console.error('[LCC Error] Image file:', imageFile);
    }

    return imageFile;
  }
}
