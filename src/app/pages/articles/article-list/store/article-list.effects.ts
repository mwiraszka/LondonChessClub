import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as ArticleListActions from './article-list.actions';
import * as ArticleListSelectors from './article-list.selectors';
import { ArticlesService } from '../../articles.service';

@Injectable()
export class ArticleListEffects {
  getArticles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.loadArticlesStarted),
      switchMap(() =>
        this.articlesService.getArticles().pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleListActions.loadArticlesFailed({ error: response.error })
              : ArticleListActions.loadArticlesSucceeded({
                  allArticles: response.payload.articles,
                })
          )
        )
      )
    )
  );

  deleteArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.deleteArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticleListSelectors.selectedArticle)),
      switchMap(([, articleToDelete]) =>
        this.articlesService.deleteArticle(articleToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleListActions.deleteArticleFailed({ error: response.error })
              : ArticleListActions.deleteArticleSucceeded({
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
          ArticleListActions.loadArticlesFailed,
          ArticleListActions.deleteArticleFailed
        ),
        tap(({ error }) => {
          console.error(`[Article List Effects]' ${error.message}`);
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
