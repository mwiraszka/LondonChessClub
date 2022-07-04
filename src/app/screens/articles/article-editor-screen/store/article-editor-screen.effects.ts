import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as ArticleEditorScreenActions from './article-editor-screen.actions';
import * as ArticleEditorScreenSelectors from './article-editor-screen.selectors';
import * as ArticleGridActions from '../../../../shared/components/article-grid/store/article-grid.actions';
import { ArticlesService } from '../../articles.service';

@Injectable()
export class ArticleEditorScreenEffects {
  resetArticleForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleGridActions.createArticleSelected),
      map(() => ArticleEditorScreenActions.resetArticleForm())
    )
  );

  getArticleToEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleGridActions.editArticleSelected),
      map((articleToEdit) =>
        ArticleEditorScreenActions.articleToEditReceived(articleToEdit)
      )
    )
  );

  publishArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorScreenActions.publishArticleConfirmed),
      concatLatestFrom(() =>
        this.store.select(ArticleEditorScreenSelectors.articleCurrently)
      ),
      switchMap(([, articleToPublish]) => {
        return this.articlesService.addArticle(articleToPublish).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleEditorScreenActions.publishArticleFailed({ error: response.error })
              : ArticleEditorScreenActions.publishArticleSucceeded({
                  publishedArticle: response.payload.article,
                })
          )
        );
      })
    )
  );

  updateArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorScreenActions.updateArticleConfirmed),
      concatLatestFrom(() =>
        this.store.select(ArticleEditorScreenSelectors.articleCurrently)
      ),
      switchMap(([, articleToUpdate]) => {
        return this.articlesService.updateArticle(articleToUpdate).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? ArticleEditorScreenActions.updateArticleFailed({ error: response.error })
              : ArticleEditorScreenActions.updateArticleSucceeded({
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
          ArticleEditorScreenActions.publishArticleFailed,
          ArticleEditorScreenActions.updateArticleFailed
        ),
        tap(({ error }) => {
          console.error(`[Article Editor Screen Effects]' ${error.message}`);
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
