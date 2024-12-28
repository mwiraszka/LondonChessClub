import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiScope, Article, DbCollection, Id, Url } from '@app/types';
import { sortArticles } from '@app/utils';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'articles';

  constructor(private readonly http: HttpClient) {}

  public getArticles(): Observable<Article[]> {
    const scope: ApiScope = 'public';
    return this.http
      .get<Article[]>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`)
      .pipe(map(articles => sortArticles(articles)));
  }

  public getArticle(id: Id): Observable<Article> {
    const scope: ApiScope = 'public';
    return this.http.get<Article>(
      `${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${id}`,
    );
  }

  public addArticle(article: Article, imageDataUrl: Url | null): Observable<Article> {
    const scope: ApiScope = 'admin';
    return this.http
      .post<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}`, {
        article,
        imageDataUrl,
      })
      .pipe(map(id => ({ ...article, id })));
  }

  public updateArticle(article: Article, imageDataUrl: Url | null): Observable<Article> {
    console.log(':: UPDATE ARTICLE', article);
    const scope: ApiScope = 'admin';
    return this.http
      .put<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${article.id}`, {
        article,
        imageDataUrl,
      })
      .pipe(map(() => article));
  }

  public deleteArticle(article: Article): Observable<Article> {
    const scope: ApiScope = 'admin';
    return this.http
      .delete<Id>(`${this.API_BASE_URL}/${scope}/${this.COLLECTION}/${article.id}`)
      .pipe(map(() => article));
  }
}
