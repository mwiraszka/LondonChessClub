import { Action, createReducer, on } from '@ngrx/store';

import type { Article } from '@app/types';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,

  on(ArticlesActions.setArticle, (state, { article, isEditMode, sectionToScrollTo }) => ({
    ...state,
    selectedArticle: article,
    articleCurrently: article,
    sectionToScrollTo: sectionToScrollTo ?? null,
    isEditMode,
  })),

  on(
    ArticlesActions.cancelSelected,
    ArticlesActions.fetchArticleFailed,
    ArticlesActions.updateArticleSucceeded,
    ArticlesActions.deleteArticleFailed,
    ArticlesActions.deleteArticleCancelled,
    state => ({
      ...state,
      selectedArticle: null,
      articleCurrently: null,
      isEditMode: null,
    }),
  ),

  on(ArticlesActions.fetchArticlesSucceeded, (state, { allArticles }) => ({
    ...state,
    articles: getSortedArtices(allArticles),
  })),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: [
      ...state.articles.filter(storedArticle => storedArticle.id !== article.id),
      article,
    ],
  })),

  on(ArticlesActions.getArticleImageUrlSucceeded, (state, { imageUrl }) => ({
    ...state,
    selectedArticle: state.selectedArticle
      ? { ...state.selectedArticle, imageUrl }
      : null,
    articleCurrently: state.articleCurrently
      ? { ...state.articleCurrently, imageUrl }
      : null,
  })),

  on(ArticlesActions.deleteArticleSelected, (state, { article }) => ({
    ...state,
    selectedArticle: article,
  })),

  on(ArticlesActions.deleteArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: state.articles.filter(storedArticle => storedArticle.id !== article.id),
    selectedArticle: null,
  })),

  on(ArticlesActions.publishArticleSucceeded, (state, { article }) => ({
    ...state,
    articleCurrently: null,
    isEditMode: null,
    articles: [...state.articles, article],
  })),

  on(ArticlesActions.updateArticleSucceeded, (state, { article }) => ({
    ...state,
    articleCurrently: initialState.articleCurrently,
    isEditMode: null,
    articles: [
      ...state.articles.map(storedArticle =>
        storedArticle.id === article.id ? article : storedArticle,
      ),
    ],
  })),

  on(ArticlesActions.formDataChanged, (state, { article }) => ({
    ...state,
    articleCurrently: article,
  })),

  on(ArticlesActions.scrolledToArticleSection, state => ({
    ...state,
    sectionToScrollTo: null,
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
