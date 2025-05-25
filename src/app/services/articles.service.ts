import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { ApiResponse, Article, DbCollection, Id } from '@app/models';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'articles';

  constructor(private readonly http: HttpClient) {}

  public getArticles(): Observable<ApiResponse<Article[]>> {
    return this.http.get<ApiResponse<Article[]>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
    );
  }

  public getArticle(id: Id): Observable<ApiResponse<Article>> {
    return this.http.get<ApiResponse<Article>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }

  public addArticle(
    article: Omit<Article, 'id'> & { id: null },
  ): Observable<ApiResponse<Id>> {
    return this.http.post<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      article,
    );
  }

  public updateArticle(article: Article): Observable<ApiResponse<Id>> {
    return this.http.put<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${article.id}`,
      article,
    );
  }

  public deleteArticle(id: Id): Observable<ApiResponse<Id>> {
    return this.http.delete<ApiResponse<Id>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }
}
