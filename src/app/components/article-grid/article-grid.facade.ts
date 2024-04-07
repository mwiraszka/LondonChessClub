import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { Article } from '@app/types';

@Injectable()
export class ArticleGridFacade {
  readonly articles$ = this.store.select(ArticlesSelectors.articles);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);

  constructor(private readonly store: Store) {}

  fetchArticles(): void {
    this.store.dispatch(ArticlesActions.fetchArticlesRequested());
  }

  onDeleteArticle(article: Article): void {
    this.store.dispatch(ArticlesActions.deleteArticleSelected({ article }));
  }
}
