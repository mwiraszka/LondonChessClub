import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

import { areSame } from '@app/shared/utils';

import * as ArticleEditorActions from './article-editor.actions';
import * as ArticleEditorSelectors from './article-editor.selectors';
import { Article } from '../../types/article.model';

@Injectable()
export class ArticleEditorFacade {
  readonly articleBeforeEdit$ = this.store.select(
    ArticleEditorSelectors.articleBeforeEdit
  );
  readonly isEditMode$ = this.store.select(ArticleEditorSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(
    ArticleEditorSelectors.hasUnsavedChanges
  );

  onCancel(): void {
    this.store.dispatch(ArticleEditorActions.cancelSelected());
  }

  onSubmit(article: Article): void {
    combineLatest([this.isEditMode$, this.articleBeforeEdit$])
      .pipe(
        map(([isEditMode, articleBeforeEdit]) => {
          const articleToSubmit: Article = {
            ...article,
            dateEdited: new Date().toISOString().substring(0, 10),
            _id: articleBeforeEdit._id,
          };

          if (isEditMode) {
            this.store.dispatch(
              ArticleEditorActions.updateArticleSelected({
                articleToUpdate: articleToSubmit,
              })
            );
          } else {
            this.store.dispatch(
              ArticleEditorActions.publishArticleSelected({
                articleToPublish: articleToSubmit,
              })
            );
          }
        }),
        first()
      )
      .subscribe();
  }

  onValueChange(article: Article): void {
    combineLatest([this.articleBeforeEdit$, this.hasUnsavedChanges$])
      .pipe(
        tap(([articleBeforeEdit, hadUnsavedChanges]) => {
          const unsavedChangesDetected = !areSame(article, articleBeforeEdit);

          if (!hadUnsavedChanges && unsavedChangesDetected) {
            this.store.dispatch(ArticleEditorActions.unsavedChangesDetected());
          } else if (hadUnsavedChanges && !unsavedChangesDetected) {
            this.store.dispatch(ArticleEditorActions.noUnsavedChangesDetected());
          }
        }),
        first()
      )
      .subscribe();
  }

  constructor(private readonly store: Store) {}
}
