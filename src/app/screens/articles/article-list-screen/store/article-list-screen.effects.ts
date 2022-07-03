import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as ArticleListScreenActions from './article-list-screen.actions';
import * as ArticleListScreenSelectors from './article-list-screen.selectors';
import { ArticlesService } from '../../articles.service';

@Injectable()
export class ArticleListScreenEffects {
  getArticles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListScreenActions.loadArticlesStarted),
      switchMap(() =>
        this.articlesService.getArticles().pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleListScreenActions.loadArticlesFailed({ error: response.error })
              : ArticleListScreenActions.loadArticlesSucceeded({
                  allArticles: response.payload.articles,
                })
          )
        )
      )
    )
  );

  deleteArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListScreenActions.deleteArticleConfirmed),
      concatLatestFrom(() =>
        this.store.select(ArticleListScreenSelectors.selectedArticle)
      ),
      switchMap(([, articleToDelete]) =>
        this.articlesService.deleteArticle(articleToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleListScreenActions.deleteArticleFailed({ error: response.error })
              : ArticleListScreenActions.deleteArticleSucceeded({
                  deletedArticle: response.payload.article,
                })
          )
        )
      )
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ArticleListScreenActions.loadArticlesFailed,
          ArticleListScreenActions.deleteArticleFailed
        ),
        tap(({ error }) => {
          console.error(`[Article List Screen Effects]' ${error.message}`);
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
