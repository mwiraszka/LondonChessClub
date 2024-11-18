import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesSelectors } from '@app/store/articles';

@Injectable()
export class ArticleEditorFacade {
  readonly controlMode$ = this.store.select(ArticlesSelectors.controlMode);
  readonly hasUnsavedChanges$ = this.store.select(ArticlesSelectors.hasUnsavedChanges);
  readonly setArticleTitle$ = this.store.select(ArticlesSelectors.setArticleTitle);

  constructor(private readonly store: Store) {}
}
