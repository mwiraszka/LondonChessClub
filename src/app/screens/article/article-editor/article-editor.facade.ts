import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesSelectors } from '@app/store/articles';

@Injectable()
export class ArticleEditorFacade {
  readonly controlMode$ = this.store.select(ArticlesSelectors.controlMode);
  readonly selectedArticleTitle$ = this.store.select(
    ArticlesSelectors.selectedArticleTitle,
  );

  constructor(private readonly store: Store) {}
}
