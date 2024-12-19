import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesSelectors } from '@app/store/articles';

@Injectable()
export class ArticleEditorFacade {
  readonly controlMode$ = this.store.select(ArticlesSelectors.selectControlMode);
  readonly hasUnsavedChanges$ = this.store.select(
    ArticlesSelectors.selectHasUnsavedChanges,
  );
  readonly articleTitle$ = this.store.select(ArticlesSelectors.selectArticleTitle);

  constructor(private readonly store: Store) {}
}
