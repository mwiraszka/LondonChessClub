import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Article } from './types/article.model';
import { ArticlesApiResponse } from './types/articles-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private http: HttpClient) {}

  getArticle(id: string): Observable<Article | null> {
    return this.http
      .get<ArticlesApiResponse>('http://localhost:3000/api/articles' + id)
      .pipe(
        map((response) => response.payload.article),
        catchError(() => {
          console.error('[Articles Service] Failed to retrieve article from database.');
          return of(null);
        })
      );
  }

  getArticles(): Observable<Article[] | null> {
    return this.http.get<ArticlesApiResponse>('http://localhost:3000/api/articles').pipe(
      map((response) => response.payload.allArticles),
      catchError(() => {
        console.error('[Articles Service] Failed to retrieve articles from database.');
        return of(null);
      })
    );
  }

  addArticle(articleToAdd: Article): Observable<Article | null> {
    const articleData = new FormData();
    articleData.append('title', articleToAdd.title);
    articleData.append('subtitle', articleToAdd.subtitle);
    articleData.append('headerImage', articleToAdd.headerImage, articleToAdd.title);
    articleData.append('authorUserId', articleToAdd.authorUserId);
    articleData.append('dateCreated', articleToAdd.dateCreated);
    articleData.append('dateEdited', articleToAdd.dateEdited);
    articleData.append('body', articleToAdd.body);

    return this.http
      .post<ArticlesApiResponse>('http://localhost:3000/api/articles', articleData)
      .pipe(
        map((response) => response.payload.addedArticle),
        catchError(() => {
          console.error(
            `[Articles Service] Failed to add ${articleToAdd.title} to database.`
          );
          return of(null);
        })
      );
  }

  updateArticle(articleToUpdate: Article): Observable<Article | null> {
    let articleData: FormData | Article;
    if (typeof articleToUpdate.headerImage === 'object') {
      articleData = new FormData();
      articleData.append('_id', articleToUpdate._id);
      articleData.append('title', articleToUpdate.title);
      articleData.append('subtitle', articleToUpdate.subtitle);
      articleData.append(
        'headerImage',
        articleToUpdate.headerImage,
        articleToUpdate.title
      );
      articleData.append('authorUserId', articleToUpdate.authorUserId);
      articleData.append('dateCreated', articleToUpdate.dateCreated);
      articleData.append('dateEdited', articleToUpdate.dateEdited);
      articleData.append('body', articleToUpdate.body);
    } else {
      articleData = { ...articleToUpdate };
    }

    return this.http
      .put<ArticlesApiResponse>(
        'http://localhost:3000/api/articles/' + articleToUpdate._id,
        articleData
      )
      .pipe(
        map((response) => response.payload.article),
        catchError(() => {
          console.error(
            `[Articles Service] Failed to update ${articleToUpdate.title} in database.`
          );
          return of(null);
        })
      );
  }

  deleteArticle(articleToDelete: Article): Observable<Article | null> {
    return this.http
      .delete<ArticlesApiResponse>(
        'http://localhost:3000/api/articles/' + articleToDelete._id
      )
      .pipe(
        map(() => articleToDelete),
        catchError(() => {
          console.error(
            `[Articles Service] Failed to delete ${articleToDelete.title} from database.`
          );
          return of(null);
        })
      );
  }
}
