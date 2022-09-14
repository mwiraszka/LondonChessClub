import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ArticlesService } from '@app/services';
import { ServiceResponse } from '@app/types';

import * as ArticlesActions from './articles.actions';
import * as ArticlesSelectors from './articles.selectors';

@Injectable()
export class ArticlesEffects {
  getArticles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.loadArticlesStarted),
      switchMap(() =>
        this.articlesService.getArticles().pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticlesActions.loadArticlesFailed({ error: response.error })
              : ArticlesActions.loadArticlesSucceeded({
                  allArticles: response.payload.articles,
                })
          )
        )
      )
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.selectedArticle)),
      switchMap(([, articleToDelete]) =>
        this.articlesService.deleteArticle(articleToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticlesActions.deleteArticleFailed({ error: response.error })
              : ArticlesActions.deleteArticleSucceeded({
                  deletedArticle: response.payload.article,
                })
          )
        )
      )
    );
  });

  resetArticleForm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.createArticleSelected),
      map(() => ArticlesActions.resetArticleForm())
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.articleCurrently)),
      switchMap(([, articleToPublish]) => {
        return this.articlesService.addArticle(articleToPublish).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticlesActions.publishArticleFailed({ error: response.error })
              : ArticlesActions.publishArticleSucceeded({
                  publishedArticle: response.payload.article,
                })
          )
        );
      })
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.articleCurrently)),
      switchMap(([, articleToUpdate]) => {
        return this.articlesService.updateArticle(articleToUpdate).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticlesActions.updateArticleFailed({ error: response.error })
              : ArticlesActions.updateArticleSucceeded({
                  updatedArticle: response.payload.article,
                })
          )
        );
      })
    );
  });

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ArticlesActions.publishArticleFailed,
          ArticlesActions.updateArticleFailed,
          ArticlesActions.loadArticlesFailed,
          ArticlesActions.deleteArticleFailed
        ),
        tap(({ error }) => {
          console.error(`[Articles] ${error.message}`);
        })
      ),
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private articlesService: ArticlesService,
    private store: Store
  ) {}
}
