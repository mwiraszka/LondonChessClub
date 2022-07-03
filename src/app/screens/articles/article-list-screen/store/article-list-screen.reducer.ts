import { Action, createReducer, on } from '@ngrx/store';

import * as ArticleListScreenActions from './article-list-screen.actions';
import { ArticleListScreenState } from './article-list-screen.state';

const initialState: ArticleListScreenState = {
  articles: [],
  selectedArticle: null,
  isLoading: false,
};

const articleListScreenReducer = createReducer(
  initialState,
  on(ArticleListScreenActions.loadArticlesStarted, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ArticleListScreenActions.loadArticlesSucceeded, (state, action) => ({
    ...state,
    articles: action.allArticles,
    isLoading: false,
  })),
  on(ArticleListScreenActions.loadArticlesFailed, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(ArticleListScreenActions.createArticleSelected, (state) => ({
    ...state,
    selectedArticle: null,
  })),
  on(ArticleListScreenActions.editArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToEdit,
  })),
  on(ArticleListScreenActions.deleteArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToDelete,
  })),
  on(ArticleListScreenActions.deleteArticleSucceeded, (state, action) => ({
    ...state,
    articles: state.articles.filter((x) => x.id != action.deletedArticle.id),
    selectedArticle: null,
  })),
  on(ArticleListScreenActions.deleteArticleFailed, (state) => ({
    ...state,
    selectedArticle: null,
  })),
  on(ArticleListScreenActions.deleteArticleCancelled, (state) => ({
    ...state,
    selectedArticle: null,
  }))
);

export function reducer(state: ArticleListScreenState, action: Action) {
  return articleListScreenReducer(state, action);
}
