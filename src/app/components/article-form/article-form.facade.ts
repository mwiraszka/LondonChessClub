import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { type Article } from '@app/types';

@Injectable()
export class ArticleFormFacade {
  readonly formArticle$ = this.store.select(ArticlesSelectors.formArticle);
  readonly articleImageCurrently$ = this.store.select(
    ArticlesSelectors.articleImageCurrently,
  );
  readonly controlMode$ = this.store.select(ArticlesSelectors.controlMode);
  readonly hasNewImage$ = this.store.select(ArticlesSelectors.hasNewImage);
  readonly hasUnsavedChanges$ = this.store.select(ArticlesSelectors.hasUnsavedChanges);
  readonly selectedArticle$ = this.store.select(ArticlesSelectors.selectedArticle);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  onRevert(): void {
    this.store.dispatch(ArticlesActions.revertArticleImageChange());
  }

  onSubmit(article: Article): void {
    this.controlMode$
      .pipe(
        map(controlMode =>
          controlMode === 'edit'
            ? this.store.dispatch(
                ArticlesActions.updateArticleSelected({
                  article,
                }),
              )
            : this.store.dispatch(
                ArticlesActions.publishArticleSelected({
                  article,
                }),
              ),
        ),
        first(),
      )
      .subscribe();
  }

  onValueChange(article: Article): void {
    this.store.dispatch(ArticlesActions.formDataChanged({ article }));
  }
}
