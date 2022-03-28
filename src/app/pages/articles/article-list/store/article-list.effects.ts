import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as ArticleListActions from './article-list.actions';
import * as ArticleListSelectors from './article-list.selectors';
import { ArticleListState } from './article-list.state';
import { ArticlesService } from '../../articles.service';

@Injectable()
export class ArticleListEffects {
  getArticles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.loadArticlesStarted),
      switchMap(() => {
        return this.articlesService.getArticles().pipe(
          map((allArticles) => {
            return ArticleListActions.loadArticlesSucceeded({ allArticles });
          }),
          catchError(() => {
            return of(
              ArticleListActions.loadArticlesFailed({
                errorMessage: '[Article List Effects] Unknown error',
              })
            );
          })
        );
      })
    )
  );

  deleteArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.deleteArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticleListSelectors.selectedArticle)),
      switchMap(([, articleToDelete]) => {
        return this.articlesService.deleteArticle(articleToDelete).pipe(
          map((deletedArticle) => {
            return ArticleListActions.deleteArticleSucceeded({ deletedArticle });
          }),
          catchError(() => {
            return of(
              ArticleListActions.deleteArticleFailed({
                errorMessage: '[Article List Effects] Unknown error',
              })
            );
          })
        );
      })
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticleListActions.loadArticlesFailed),
        tap(({ errorMessage }) => {
          console.error(errorMessage);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private articlesService: ArticlesService,
    private store: Store<ArticleListState>
  ) {}
}
