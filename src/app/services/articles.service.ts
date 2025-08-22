import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  ApiResponse,
  Article,
  DataPaginationOptions,
  DbCollection,
  Id,
  PaginatedItems,
} from '@app/models';
import { setPaginationParams } from '@app/utils';

import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly API_BASE_URL = environment.lccApiBaseUrl;
  private readonly COLLECTION: DbCollection = 'articles';

  constructor(private readonly http: HttpClient) {}

  public getArticles(
    options: DataPaginationOptions<Article>,
  ): Observable<ApiResponse<PaginatedItems<Article>>> {
    const params = setPaginationParams(options);
    return this.http.get<ApiResponse<PaginatedItems<Article>>>(
      `${this.API_BASE_URL}/${this.COLLECTION}`,
      { params },
    );
  }

  public getArticle(id: Id): Observable<ApiResponse<Article>> {
    return this.http.get<ApiResponse<Article>>(
      `${this.API_BASE_URL}/${this.COLLECTION}/${id}`,
    );
  }

  public addArticle(article: Article): Observable<ApiResponse<Id>> {
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
