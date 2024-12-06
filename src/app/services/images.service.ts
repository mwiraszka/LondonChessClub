import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { Article, Url } from '@app/types';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  readonly API_ENDPOINT = environment.imagesEndpoint;

  constructor(private http: HttpClient) {}

  uploadArticleImage(article: Article): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('imageFile', article.imageFile!);
    formData.append('imageId', article.imageId!);

    return this.http.post<any>(this.API_ENDPOINT, formData).pipe(
      map(() => {
        return { payload: article };
      }),
      catchError(() => of({ error: new Error('Failed to store image in database') })),
    );
  }

  deleteArticleImage(article: Article): Observable<any> {
    return this.http.delete<any>(this.API_ENDPOINT + article.imageId).pipe(
      map(() => {
        return { payload: article };
      }),
      catchError(() => of({ error: new Error('Failed to delete image from database') })),
    );
  }

  getArticleThumbnailImageUrls(articles: Article[]): Observable<any> {
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

  getArticleImageUrl(imageId?: string | null): Observable<any> {
    if (!imageId) {
      return of({
        error: new Error('Article does not contain an image ID'),
      });
    }

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'ContentType: text',
      'Access-Control-Max-Age': '86400',
    });

    return this.http
      .options(this.API_ENDPOINT + imageId, {
        headers,
        responseType: 'text',
      })
      .pipe(
        switchMap(() => this.http.get<any>(this.API_ENDPOINT + imageId)),
        catchError(() =>
          of({
            error: new Error('Failed to get image presigned URL'),
          }),
        ),
      );
  }

  getArticleImageFile(imageUrl: Url): Observable<any> {
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
