import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '@app/core/auth';

import * as ArticleListScreenActions from './store/article-list-screen.actions';
import * as ArticleListScreenSelectors from './store/article-list-screen.selectors';
import { Article } from '../types/article.model';

@Injectable()
export class ArticleListScreenFacade {
  readonly articles$ = this.store.select(ArticleListScreenSelectors.articles);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly isLoading$ = this.store.select(ArticleListScreenSelectors.isLoading);

  constructor(private readonly store: Store) {}

  loadArticles(): void {
    this.store.dispatch(ArticleListScreenActions.loadArticlesStarted());
  }

  onComposeArticle(): void {
    this.store.dispatch(ArticleListScreenActions.createArticleSelected());
  }

  onEditArticle(article: Article): void {
    this.store.dispatch(
      ArticleListScreenActions.editArticleSelected({ articleToEdit: article })
    );
  }

  onDeleteArticle(article: Article): void {
    this.store.dispatch(
      ArticleListScreenActions.deleteArticleSelected({ articleToDelete: article })
    );
  }
}
