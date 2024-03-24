/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService, ImagesService } from '@app/services';
import type { Article, FlatArticle, ServiceResponse } from '@app/types';
import { generateArticleId, generateArticleImageId, isEmpty } from '@app/utils';

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

  getArticle(id: string): Observable<ServiceResponse<Article>> {
    return this.http.get<FlatArticle>(this.API_ENDPOINT + id).pipe(
      switchMap(article => {
        const adaptedArticle = this.adaptForFrontend([article])[0];

        return this.imagesService.getArticleImageUrl(adaptedArticle.imageId!).pipe(
          map(response => {
            return { payload: { ...adaptedArticle, imageUrl: response.payload! } };
          }),
        );
      }),
      catchError(() => of({ error: new Error('Failed to fetch article from database') })),
    );
  }

  getArticles(): Observable<ServiceResponse<Article[]>> {
    return this.http.get<FlatArticle[]>(this.API_ENDPOINT).pipe(
      switchMap(articles => {
        const adaptedArticles = this.adaptForFrontend(articles);

        const articlesWithImageUrls$: Observable<Article>[] = [];
        adaptedArticles.forEach(article => {
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
    const articleId = generateArticleId();
    const modifiedArticleToAdd = {
      ...articleToAdd,
      id: articleId,
      imageId: generateArticleImageId(articleId),
    };
    const flattenedArticle = this.adaptForBackend([modifiedArticleToAdd])[0];

    return this.authService.token().pipe(
      switchMap(token =>
        this.http.post<null>(this.API_ENDPOINT, flattenedArticle, {
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
    const flattenedArticle = this.adaptForBackend([articleToUpdate])[0];

    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(this.API_ENDPOINT + flattenedArticle.id, flattenedArticle, {
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

  private adaptForFrontend(articles: FlatArticle[]): Article[] {
    return articles.map(article => {
      return {
        id: article.id,
        title: article.title,
        body: article.body,
        imageFile: null,
        imageId: article.imageId,
        imageUrl: null,
        thumbnailImageUrl: null,
        isSticky: article?.isSticky,
        modificationInfo: {
          dateCreated: new Date(article.dateCreated),
          createdBy: article.createdBy,
          dateLastEdited: new Date(article.dateLastEdited),
          lastEditedBy: article.lastEditedBy,
        },
      };
    });
  }

  private adaptForBackend(articles: Article[]): FlatArticle[] {
    return articles.map(article => {
      return {
        id: article.id,
        title: article.title,
        body: article.body,
        imageFile: article.imageFile,
        imageId: article.imageId,
        imageUrl: article.imageUrl,
        thumbnailImageUrl: article.thumbnailImageUrl,
        isSticky: article.isSticky,
        dateCreated: article.modificationInfo!.dateCreated.toISOString(),
        createdBy: article.modificationInfo!.createdBy,
        dateLastEdited: article.modificationInfo!.dateLastEdited.toISOString(),
        lastEditedBy: article.modificationInfo!.lastEditedBy,
      };
    });
  }
}
