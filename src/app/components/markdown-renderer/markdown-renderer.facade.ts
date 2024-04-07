import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';

@Injectable()
export class MarkdownRendererFacade {
  readonly sectionToScrollTo$ = this.store.select(ArticlesSelectors.sectionToScrollTo);

  constructor(private readonly store: Store) {}

  onScrollToSection(): void {
    this.store.dispatch(ArticlesActions.scrolledToArticleSection());
  }
}
