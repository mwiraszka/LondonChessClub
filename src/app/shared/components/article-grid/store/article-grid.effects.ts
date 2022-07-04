import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as ArticleGridActions from './article-grid.actions';
import * as ArticleGridSelectors from './article-grid.selectors';
import { ArticlesService } from '../../../../screens/articles/articles.service';

@Injectable()
export class ArticleGridEffects {
  getArticles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleGridActions.loadArticlesStarted),
      switchMap(() =>
        this.articlesService.getArticles().pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleGridActions.loadArticlesFailed({ error: response.error })
              : ArticleGridActions.loadArticlesSucceeded({
                  allArticles: response.payload.articles,
                })
          )
        )
      )
    )
  );

  deleteArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleGridActions.deleteArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticleGridSelectors.selectedArticle)),
      switchMap(([, articleToDelete]) =>
        this.articlesService.deleteArticle(articleToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleGridActions.deleteArticleFailed({ error: response.error })
              : ArticleGridActions.deleteArticleSucceeded({
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
          ArticleGridActions.loadArticlesFailed,
          ArticleGridActions.deleteArticleFailed
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
