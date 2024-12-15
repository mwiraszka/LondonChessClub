import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ToasterActions } from '@app/store/toaster';
import type { Article, ControlModes } from '@app/types';

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

  onSubmit(controlMode: ControlModes, article: Article): void {
    if (controlMode === 'edit') {
      this.store.dispatch(
        ArticlesActions.updateArticleSelected({
          article,
        }),
      );
    } else {
      this.store.dispatch(
        ArticlesActions.publishArticleSelected({
          article,
        }),
      );
    }
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
