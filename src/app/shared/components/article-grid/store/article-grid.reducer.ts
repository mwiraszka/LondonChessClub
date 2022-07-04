import { Action, createReducer, on } from '@ngrx/store';

import * as ArticleGridActions from './article-grid.actions';
import { ArticleGridState } from './article-grid.state';

const initialState: ArticleGridState = {
  articles: [],
  selectedArticle: null,
  isLoading: false,
};

const articleGridReducer = createReducer(
  initialState,
  on(ArticleGridActions.loadArticlesStarted, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ArticleGridActions.loadArticlesSucceeded, (state, action) => ({
    ...state,
    articles: action.allArticles,
    isLoading: false,
  })),
  on(ArticleGridActions.loadArticlesFailed, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(ArticleGridActions.createArticleSelected, (state) => ({
    ...state,
    selectedArticle: null,
  })),
  on(ArticleGridActions.editArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToEdit,
  })),
  on(ArticleGridActions.deleteArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToDelete,
  })),
  on(ArticleGridActions.deleteArticleSucceeded, (state, action) => ({
    ...state,
    articles: state.articles.filter((x) => x.id != action.deletedArticle.id),
    selectedArticle: null,
  })),
  on(ArticleGridActions.deleteArticleFailed, (state) => ({
    ...state,
    selectedArticle: null,
  })),
  on(ArticleGridActions.deleteArticleCancelled, (state) => ({
    ...state,
    selectedArticle: null,
  }))
);

export function reducer(state: ArticleGridState, action: Action) {
  return articleGridReducer(state, action);
}
