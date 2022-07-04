import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '@app/core/auth';
import { Article } from '@app/shared/types';

import * as ArticleGridActions from './store/article-grid.actions';
import * as ArticleGridSelectors from './store/article-grid.selectors';

@Injectable()
export class ArticleGridFacade {
  readonly articles$ = this.store.select(ArticleGridSelectors.articles);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly isLoading$ = this.store.select(ArticleGridSelectors.isLoading);

  constructor(private readonly store: Store) {}

  loadArticles(): void {
    this.store.dispatch(ArticleGridActions.loadArticlesStarted());
  }

  onComposeArticle(): void {
    this.store.dispatch(ArticleGridActions.createArticleSelected());
  }

  onEditArticle(article: Article): void {
    this.store.dispatch(
      ArticleGridActions.editArticleSelected({ articleToEdit: article })
    );
  }

  onDeleteArticle(article: Article): void {
    this.store.dispatch(
      ArticleGridActions.deleteArticleSelected({ articleToDelete: article })
    );
  }
}
