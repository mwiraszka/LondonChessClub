/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isEmpty } from 'lodash';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService, ImagesService } from '@app/services';
import { Article, ServiceResponse } from '@app/types';
import { generateArticleId, generateArticleImageId } from '@app/utils';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  readonly API_ENDPOINT = environment.cognito.articlesEndpoint;

  constructor(
    private authService: AuthService,
    private imagesService: ImagesService,
    private http: HttpClient,
  ) {}

  // Not currently used anywhere
  getArticle(id: string): Observable<ServiceResponse<Article>> {
    return this.http.get<Article>(this.API_ENDPOINT + id).pipe(
      switchMap(article =>
        this.imagesService.getArticleImageUrl(article.imageId!).pipe(
          map(response => {
            return { payload: { ...article, imageUrl: response.payload! } };
          }),
        ),
      ),
      catchError(() => of({ error: new Error('Failed to fetch article from database') })),
    );
  }

  getArticles(): Observable<ServiceResponse<Article[]>> {
    return this.http.get<Article[]>(this.API_ENDPOINT).pipe(
      switchMap(articles => {
        const articlesWithImageUrls$: Observable<Article>[] = [];
        articles.forEach(article => {
          const thumbnailImageId = `${article.imageId!}-600x400`;
          const articleWithImageUrl$ = this.imagesService
            .getArticleImageUrl(thumbnailImageId)
            .pipe(
              map(response => {
                return { ...article, thumbnailImageUrl: response.payload! };
              }),
            );
          articlesWithImageUrls$.push(articleWithImageUrl$);
        });
        return forkJoin(articlesWithImageUrls$);
      }),
      map(articlesWithImageUrls => {
        return { payload: articlesWithImageUrls };
      }),
      catchError(() =>
        of({ error: new Error('Failed to fetch articles from database') }),
      ),
    );
  }

  addArticle(articleToAdd: Article): Observable<ServiceResponse<Article>> {
    // Escaping the backslash for new lines seems necessary to work with API Gateway
    // integration mapping set up for this endpoint (not needed for updateArticle())
    const articleId = generateArticleId();
    const modifiedArticleToAdd = {
      ...articleToAdd,
      id: articleId,
      imageId: generateArticleImageId(articleId),
      body: articleToAdd.body.replaceAll('\n', '\\n'),
    };

    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(this.API_ENDPOINT, modifiedArticleToAdd, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      switchMap(() => this.imagesService.uploadArticleImage(modifiedArticleToAdd)),
      catchError(() => of({ error: new Error('Failed to add article to database') })),
    );
  }

  updateArticle(articleToUpdate: Article): Observable<ServiceResponse<Article>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(this.API_ENDPOINT + articleToUpdate.id, articleToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      switchMap(() => {
        if (isEmpty(articleToUpdate.imageFile)) {
          return of({ payload: articleToUpdate });
        } else {
          return this.imagesService.uploadArticleImage(articleToUpdate);
        }
      }),
      catchError(() => of({ error: new Error('Failed to update article') })),
    );
  }

  deleteArticle(articleToDelete: Article): Observable<ServiceResponse<Article>> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<null>(this.API_ENDPOINT + articleToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      switchMap(() => this.imagesService.deleteArticleImage(articleToDelete)),
      catchError(() =>
        of({ error: new Error('Failed to delete article from database') }),
      ),
    );
  }
}
