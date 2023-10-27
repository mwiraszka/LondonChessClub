/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesService, ImagesService } from '@app/services';
import { Article, ServiceResponse } from '@app/types';

import * as ArticlesActions from './articles.actions';
import * as ArticlesSelectors from './articles.selectors';

@Injectable()
export class ArticlesEffects {
  getArticles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.loadArticlesStarted),
      switchMap(() =>
        this.articlesService.getArticles().pipe(
          map((response: ServiceResponse<Article[]>) =>
            response.error
              ? ArticlesActions.loadArticlesFailed({ error: response.error })
              : ArticlesActions.loadArticlesSucceeded({
                  allArticles: response.payload!,
                }),
          ),
        ),
      ),
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.selectedArticle)),
      filter(([, articleToDelete]) => !!articleToDelete),
      switchMap(([, articleToDelete]) =>
        this.imagesService.deleteImage(articleToDelete!),
      ),
      switchMap(response => {
        if (response.error) {
          return throwError(() => new Error('[Articles] Unable to delete image'));
        }
        return this.articlesService.deleteArticle(response!.payload!).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.deleteArticleFailed({ error: response.error })
              : ArticlesActions.deleteArticleSucceeded({
                  deletedArticle: response.payload!,
                }),
          ),
        );
      }),
    );
  });

  resetArticleForm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.createArticleSelected),
      map(() => ArticlesActions.resetArticleForm()),
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.articleCurrently)),
      switchMap(([, articleToPublish]) => {
        return this.articlesService.addArticle(articleToPublish).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.publishArticleFailed({ error: response.error })
              : ArticlesActions.publishArticleSucceeded({
                  publishedArticle: response.payload!,
                }),
          ),
        );
      }),
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.articleCurrently)),
      switchMap(([, articleToUpdate]) => {
        return this.articlesService.updateArticle(articleToUpdate).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.updateArticleFailed({ error: response.error })
              : ArticlesActions.updateArticleSucceeded({
                  updatedArticle: response.payload!,
                }),
          ),
        );
      }),
    );
  });

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ArticlesActions.publishArticleFailed,
          ArticlesActions.updateArticleFailed,
          ArticlesActions.loadArticlesFailed,
          ArticlesActions.deleteArticleFailed,
        ),
        tap(({ error }) => {
          console.error(`[Articles] ${error.message}`);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private articlesService: ArticlesService,
    private imagesService: ImagesService,
    private store: Store,
  ) {}
}
