import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { Article } from '@app/types';

@Injectable()
export class ArticleViewerScreenFacade {
  readonly article$ = this.store.select(ArticlesSelectors.selectedArticle);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly isLoading$ = this.store.select(ArticlesSelectors.isLoading);

  constructor(private readonly store: Store) {}

  onEdit(article: Article): void {
    this.store.dispatch(ArticlesActions.editArticleSelected({ articleToEdit: article }));
  }

  onDelete(article: Article): void {
    this.store.dispatch(
      ArticlesActions.deleteArticleSelected({ articleToDelete: article }),
    );
  }
}
