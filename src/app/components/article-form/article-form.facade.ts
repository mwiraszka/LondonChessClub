import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { Article } from '@app/types';
import { isEmpty } from '@app/utils';

@Injectable()
export class ArticleFormFacade {
  readonly articleBeforeEdit$ = this.store.select(ArticlesSelectors.articleBeforeEdit);
  readonly articleCurrently$ = this.store.select(ArticlesSelectors.articleCurrently);
  readonly isEditMode$ = this.store.select(ArticlesSelectors.isEditMode);
  readonly hasUnsavedChanges$ = this.store.select(ArticlesSelectors.hasUnsavedChanges);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  onSubmit(article: Article): void {
    this.isEditMode$
      .pipe(
        map(isEditMode => {
          if (isEditMode) {
            this.store.dispatch(
              ArticlesActions.updateArticleSelected({
                articleToUpdate: article,
              }),
            );
          } else {
            this.store.dispatch(
              ArticlesActions.publishArticleSelected({
                articleToPublish: article,
              }),
            );
          }
        }),
        first(),
      )
      .subscribe();
  }

  onValueChange(article: Article): void {
    if (isEmpty(article.imageFile)) {
      article = { ...article, imageFile: null };
    }
    this.store.dispatch(ArticlesActions.formDataChanged({ article }));
  }
}
