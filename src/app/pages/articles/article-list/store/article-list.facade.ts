import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as ArticleListActions from './article-list.actions';
import * as ArticleListSelectors from './article-list.selectors';
import { Article, MOCK_ARTICLES } from '../../types/article.model';

@Injectable()
export class ArticleListFacade {
  // readonly articles$ = this.store.select(ArticleListSelectors.articles);
  readonly articles$ = of(MOCK_ARTICLES); // temp
  readonly isLoading$ = this.store.select(ArticleListSelectors.isLoading);

  constructor(private readonly store: Store) {}

  loadArticles(): void {
    this.store.dispatch(ArticleListActions.loadArticlesStarted());
  }

  onComposeArticle(): void {
    this.store.dispatch(ArticleListActions.createArticleSelected());
  }

  onEditArticle(article: Article): void {
    this.store.dispatch(
      ArticleListActions.editArticleSelected({ articleToEdit: article })
    );
  }

  onDeleteArticle(article: Article): void {
    this.store.dispatch(
      ArticleListActions.deleteArticleSelected({ articleToDelete: article })
    );
  }
}
