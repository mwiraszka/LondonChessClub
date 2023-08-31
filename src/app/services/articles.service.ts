import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Article, ServiceResponse } from '@app/types';

import { environment } from '@environments/environment';

import { AuthService } from './auth.service';

const API_ENDPOINT = environment.cognito.articlesEndpoint;
@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getArticle(id: string): Observable<ServiceResponse> {
    return this.http.get<Article>(API_ENDPOINT + id).pipe(
      map(article => ({ payload: { article } })),
      catchError(() => of({ error: new Error('Failed to fetch article from database') })),
    );
  }

  getArticles(): Observable<ServiceResponse> {
    return this.http.get<Article[]>(API_ENDPOINT).pipe(
      map(articles => ({ payload: { articles } })),
      catchError(() =>
        of({ error: new Error('Failed to fetch articles from database') }),
      ),
    );
  }

  addArticle(articleToAdd: Article): Observable<ServiceResponse> {
    // Escaping the backslash for new lines seems necessary to work with API Gateway
    // integration mapping set up for this endpoint (not needed for updateEvent())
    articleToAdd = {
      ...articleToAdd,
      body: articleToAdd.body.replaceAll('\n', '\\n'),
    };

    return this.authService.token().pipe(
      switchMap(token =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.http.post<any>(API_ENDPOINT, articleToAdd, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: { article: articleToAdd } })),
      catchError(() => of({ error: new Error('Failed to add article to database') })),
    );
  }

  updateArticle(articleToUpdate: Article): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.put<null>(API_ENDPOINT + articleToUpdate.id, articleToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: { article: articleToUpdate } })),
      catchError(() => of({ error: new Error('Failed to update article') })),
    );
  }

  deleteArticle(articleToDelete: Article): Observable<ServiceResponse> {
    return this.authService.token().pipe(
      switchMap(token =>
        this.http.delete<null>(API_ENDPOINT + articleToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        }),
      ),
      map(() => ({ payload: { article: articleToDelete } })),
      catchError(() =>
        of({ error: new Error('Failed to delete article from database') }),
      ),
    );
  }
}
