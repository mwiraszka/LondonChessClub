import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';

import * as ArticleEditorScreenActions from './store/article-editor-screen.actions';
import * as ArticleEditorScreenSelectors from './store/article-editor-screen.selectors';
import { Article } from '../../../shared/types/article.model';

@Injectable()
export class ArticleEditorScreenFacade {
  readonly articleBeforeEdit$ = this.store.select(
    ArticleEditorScreenSelectors.articleBeforeEdit
  );
  readonly articleCurrently$ = this.store.select(
    ArticleEditorScreenSelectors.articleCurrently
  );
  readonly isEditMode$ = this.store.select(ArticleEditorScreenSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(
    ArticleEditorScreenSelectors.hasUnsavedChanges
  );

  onCancel(): void {
    this.store.dispatch(ArticleEditorScreenActions.cancelSelected());
  }

  onSubmit(article: Article): void {
    combineLatest([this.isEditMode$, this.articleBeforeEdit$])
      .pipe(
        map(([isEditMode, articleBeforeEdit]) => {
          const articleToSubmit: Article = {
            ...article,
            dateEdited: new Date().toISOString().substring(0, 10),
            id: articleBeforeEdit.id,
          };

          if (isEditMode) {
            this.store.dispatch(
              ArticleEditorScreenActions.updateArticleSelected({
                articleToUpdate: articleToSubmit,
              })
            );
          } else {
            this.store.dispatch(
              ArticleEditorScreenActions.publishArticleSelected({
                articleToPublish: articleToSubmit,
              })
            );
          }
        }),
        first()
      )
      .subscribe();
  }

  onValueChange(formData: Article): void {
    this.store.dispatch(ArticleEditorScreenActions.formDataChanged({ formData }));
  }

  constructor(private readonly store: Store) {}
}
