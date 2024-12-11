import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, Article, DbCollection, Id } from '@app/types';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  readonly API_URL = environment.lccApiUrl;
  readonly COLLECTION: DbCollection = 'articles';

  constructor(private http: HttpClient) {}

  public getArticles(): Observable<Article[]> {
    const scope: ApiScope = 'public';
    return this.http.get<Article[]>(`${this.API_URL}/${scope}/${this.COLLECTION}`);
  }

  public getArticle(id: Id): Observable<Article> {
    const scope: ApiScope = 'public';
    return this.http.get<Article>(`${this.API_URL}/${scope}/${this.COLLECTION}/${id}`);
  }

  public addArticle(article: Article): Observable<Article> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}`, article)
      .pipe(map(id => ({ ...article, id })));
  }

  public updateArticle(article: Article): Observable<Article> {
    const scope: ApiScope = 'admin';
    return this.http
      .put<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}/${article.id}`, article)
      .pipe(map(() => article));
  }

  public deleteArticle(article: Article): Observable<Article> {
    const scope: ApiScope = 'admin';
    return this.http
      .delete<Id>(`${this.API_URL}/${scope}/${this.COLLECTION}/${article.id}`)
      .pipe(map(() => article));
  }
}
