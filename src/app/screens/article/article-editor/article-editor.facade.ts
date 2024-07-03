import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesSelectors } from '@app/store/articles';

@Injectable()
export class ArticleEditorFacade {
  readonly isEditMode$ = this.store.select(ArticlesSelectors.isEditMode);
  readonly selectedArticleTitle$ = this.store.select(
    ArticlesSelectors.selectedArticleTitle,
  );

  constructor(private readonly store: Store) {}
}
