import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

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
      map((article) => ({ payload: { article } })),
      catchError(() => of({ error: new Error('Failed to fetch article from database') }))
    );
  }

  getArticles(): Observable<ServiceResponse> {
    return this.http.get<Article[]>(API_ENDPOINT).pipe(
      map((articles) => ({ payload: { articles } })),
      catchError(() => of({ error: new Error('Failed to fetch articles from database') }))
    );
    // return of({ error: new Error('Articles API call temporarily disabled') });
  }

  addArticle(articleToAdd: Article): Observable<ServiceResponse> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.post<any>(API_ENDPOINT, articleToAdd, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      map(() => ({ payload: { article: articleToAdd } })),
      catchError(() => of({ error: new Error('Failed to add article to database') }))
    );
  }

  updateArticle(articleToUpdate: Article): Observable<ServiceResponse> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.put<null>(API_ENDPOINT + articleToUpdate.id, articleToUpdate, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      map(() => ({ payload: { article: articleToUpdate } })),
      catchError(() => of({ error: new Error('Failed to update article') }))
    );
  }

  deleteArticle(articleToDelete: Article): Observable<ServiceResponse> {
    return this.authService.getToken().pipe(
      switchMap((token) =>
        this.http.delete<null>(API_ENDPOINT + articleToDelete.id, {
          headers: new HttpHeaders({
            Authorization: token,
          }),
        })
      ),
      map(() => ({ payload: { article: articleToDelete } })),
      catchError(() => of({ error: new Error('Failed to delete article from database') }))
    );
  }
}
