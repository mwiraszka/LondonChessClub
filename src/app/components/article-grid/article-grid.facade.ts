import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '@app/store/auth';
import { Article } from '@app/types';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';

@Injectable()
export class ArticleGridFacade {
  readonly articles$ = this.store.select(ArticlesSelectors.articles);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly isLoading$ = this.store.select(ArticlesSelectors.isLoading);

  constructor(private readonly store: Store) {}

  loadArticles(): void {
    this.store.dispatch(ArticlesActions.loadArticlesStarted());
  }

  onCreateArticle(): void {
    this.store.dispatch(ArticlesActions.createArticleSelected());
  }

  onEditArticle(article: Article): void {
    this.store.dispatch(ArticlesActions.editArticleSelected({ articleToEdit: article }));
  }

  onDeleteArticle(article: Article): void {
    this.store.dispatch(
      ArticlesActions.deleteArticleSelected({ articleToDelete: article })
    );
  }
}
