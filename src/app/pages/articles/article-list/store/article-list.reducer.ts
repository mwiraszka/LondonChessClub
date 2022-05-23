import { Action, createReducer, on } from '@ngrx/store';

import * as ArticleListActions from './article-list.actions';
import { ArticleListState } from './article-list.state';

const initialState: ArticleListState = {
  articles: [],
  selectedArticle: null,
  isLoading: false,
};

const articleListReducer = createReducer(
  initialState,
  on(ArticleListActions.loadArticlesStarted, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ArticleListActions.loadArticlesSucceeded, (state, action) => ({
    ...state,
    articles: action.allArticles,
    isLoading: false,
  })),
  on(ArticleListActions.loadArticlesFailed, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(ArticleListActions.createArticleSelected, (state) => ({
    ...state,
    selectedArticle: null,
  })),
  on(ArticleListActions.editArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToEdit,
  })),
  on(ArticleListActions.deleteArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToDelete,
  })),
  on(ArticleListActions.deleteArticleSucceeded, (state, action) => ({
    ...state,
    articles: state.articles.filter((x) => x.id != action.deletedArticle.id),
    selectedArticle: null,
  })),
  on(ArticleListActions.deleteArticleFailed, (state) => ({
    ...state,
    selectedArticle: null,
  })),
  on(ArticleListActions.deleteArticleCancelled, (state) => ({
    ...state,
    selectedArticle: null,
  }))
);

export function reducer(state: ArticleListState, action: Action) {
  return articleListReducer(state, action);
}
