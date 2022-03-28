import { Injectable } from '@angular/core';
import { concatLatestFrom, createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as ArticleEditorActions from './article-editor.actions';
import * as ArticleEditorSelectors from './article-editor.selectors';
import * as ArticleListActions from '../../article-list/store/article-list.actions';
import { ArticlesService } from '../../articles.service';

@Injectable()
export class ArticleEditorEffects {
  getArticleToEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.editArticleSelected),
      map((articleToEdit) => {
        return ArticleEditorActions.articleToEditReceived(articleToEdit);
      })
    )
  );

  publishArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.publishArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticleEditorSelectors.articleAfterEdit)),
      switchMap(([, articleToPublish]) => {
        return this.articlesService.addArticle(articleToPublish).pipe(
          map((publishedArticle) => {
            return ArticleEditorActions.publishArticleSucceeded({ publishedArticle });
          }),
          catchError(() => {
            return of(
              ArticleEditorActions.publishArticleFailed({
                errorMessage: '[Article Editor Effects] Unknown error',
              })
            );
          })
        );
      })
    )
  );

  updateArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.updateArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticleEditorSelectors.articleAfterEdit)),
      switchMap(([, articleToUpdate]) => {
        return this.articlesService.updateArticle(articleToUpdate).pipe(
          map((updatedArticle) => {
            return ArticleEditorActions.updateArticleSucceeded({ updatedArticle });
          }),
          catchError(() => {
            return of(
              ArticleEditorActions.updateArticleFailed({
                errorMessage: '[Article Editor Effects] Unknown error',
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
        ofType(
          ArticleEditorActions.publishArticleFailed,
          ArticleEditorActions.updateArticleFailed
        ),
        tap(({ errorMessage }) => {
          console.error(errorMessage);
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
