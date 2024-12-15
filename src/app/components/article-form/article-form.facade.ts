import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ToasterActions } from '@app/store/toaster';
import type { Article } from '@app/types';

@Injectable()
export class ArticleFormFacade {
  readonly controlMode$ = this.store.select(ArticlesSelectors.controlMode);
  readonly formArticle$ = this.store.select(ArticlesSelectors.formArticle);
  readonly hasUnsavedChanges$ = this.store.select(ArticlesSelectors.hasUnsavedChanges);
  readonly setArticle$ = this.store.select(ArticlesSelectors.setArticle);

  constructor(private readonly store: Store) {}

  onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  onSubmit(article: Article, imageFile: File): void {
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

  onUnsupportedLocalStorage(): void {
    this.store.dispatch(ToasterActions.localStorageDetectedUnsupported());
  }

  onLocalStorageQuotaExceededError(): void {
    this.store.dispatch(ToasterActions.localStorageDetectedFull());
  }
}
