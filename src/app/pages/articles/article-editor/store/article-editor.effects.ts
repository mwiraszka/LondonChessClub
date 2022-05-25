import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as ArticleEditorActions from './article-editor.actions';
import * as ArticleEditorSelectors from './article-editor.selectors';
import * as ArticleListActions from '../../article-list/store/article-list.actions';
import { ArticlesService } from '../../articles.service';

@Injectable()
export class ArticleEditorEffects {
  resetArticleForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.createArticleSelected),
      map(() => ArticleEditorActions.resetArticleForm())
    )
  );

  getArticleToEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.editArticleSelected),
      map((articleToEdit) => ArticleEditorActions.articleToEditReceived(articleToEdit))
    )
  );

  publishArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.publishArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticleEditorSelectors.articleCurrently)),
      switchMap(([, articleToPublish]) => {
        return this.articlesService.addArticle(articleToPublish).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleEditorActions.publishArticleFailed({ error: response.error })
              : ArticleEditorActions.publishArticleSucceeded({
                  publishedArticle: response.payload.article,
                })
          )
        );
      })
    )
  );

  updateArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.updateArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticleEditorSelectors.articleCurrently)),
      switchMap(([, articleToUpdate]) => {
        return this.articlesService.updateArticle(articleToUpdate).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleEditorActions.updateArticleFailed({ error: response.error })
              : ArticleEditorActions.updateArticleSucceeded({
                  updatedArticle: response.payload.article,
                })
          )
        );
      })
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ArticleEditorActions.publishArticleFailed,
          ArticleEditorActions.updateArticleFailed
        ),
        tap(({ error }) => {
          console.error(`[Article Editor Effects]' ${error.message}`);
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
