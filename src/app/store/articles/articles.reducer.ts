import { Action, createReducer, on } from '@ngrx/store';

import { Article } from '@app/types';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,
  on(ArticlesActions.loadArticlesStarted, state => ({
    ...state,
    isLoading: true,
  })),

  on(ArticlesActions.loadArticlesSucceeded, (state, action) => ({
    ...state,
    articles: getSortedArtices(action.allArticles),
    isLoading: false,
  })),

  on(ArticlesActions.loadArticlesFailed, state => ({
    ...state,
    isLoading: false,
  })),

  on(ArticlesActions.viewArticleRouteEntered, (state, action) => ({
    ...state,
    selectedArticle: action.article,
    articleBeforeEdit: action.article,
    articleCurrently: action.article,
  })),

  on(ArticlesActions.getArticleImageUrlSucceeded, (state, action) => ({
    ...state,
    selectedArticle: state.selectedArticle
      ? { ...state.selectedArticle, imageUrl: action.imageUrl }
      : null,
    articleBeforeEdit: { ...state.articleBeforeEdit, imageUrl: action.imageUrl },
    articleCurrently: { ...state.articleCurrently, imageUrl: action.imageUrl },
  })),

  on(ArticlesActions.editArticleRouteEntered, (state, action) => ({
    ...state,
    selectedArticle: action.article,
    articleBeforeEdit: action.article,
    articleCurrently: action.article,
    isEditMode: true,
  })),

  on(ArticlesActions.deleteArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToDelete,
  })),

  on(ArticlesActions.deleteArticleSucceeded, (state, action) => ({
    ...state,
    articles: state.articles.filter(x => x.id != action.deletedArticle.id),
    selectedArticle: null,
  })),

  on(ArticlesActions.deleteArticleFailed, state => ({
    ...state,
    selectedArticle: null,
  })),

  on(ArticlesActions.deleteArticleCancelled, state => ({
    ...state,
    selectedArticle: null,
  })),

  on(
    ArticlesActions.resetArticleForm,
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.publishArticleFailed,
    ArticlesActions.updateArticleSucceeded,
    ArticlesActions.updateArticleFailed,
    ArticlesActions.cancelConfirmed,
    state => ({
      ...state,
      articleBeforeEdit: initialState.articleBeforeEdit,
      articleCurrently: initialState.articleCurrently,
      isEditMode: false,
    }),
  ),

  on(ArticlesActions.formDataChanged, (state, action) => ({
    ...state,
    articleCurrently: action.article,
  })),
);

export function reducer(state: ArticlesState, action: Action): ArticlesState {
  return articlesReducer(state, action);
}

// TODO: Add support for booleans in customSort function and refactor to be more efficient/performant
function getSortedArtices(articles: Article[]): Article[] {
  const stickyArticles = [...articles.filter(article => article.isSticky)].sort(
    customSort('modificationInfo.dateCreated', false),
  );
  const remainingArticles = [...articles.filter(article => !article.isSticky)].sort(
    customSort('modificationInfo.dateCreated', false),
  );
  return [...stickyArticles, ...remainingArticles];
}
