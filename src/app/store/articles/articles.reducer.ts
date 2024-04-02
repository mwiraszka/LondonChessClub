import { Action, createReducer, on } from '@ngrx/store';

import type { Article } from '@app/types';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,

  on(ArticlesActions.fetchArticlesSucceeded, (state, { allArticles }) => ({
    ...state,
    articles: getSortedArtices(allArticles),
  })),

  on(
    ArticlesActions.fetchArticleForViewScreenSucceeded,
    ArticlesActions.fetchArticleForEditScreenSucceeded,
    (state, { article }) => ({
      ...state,
      articles: [
        ...state.articles.filter(storedArticle => storedArticle.id !== article.id),
        article,
      ],
    }),
  ),

  on(ArticlesActions.articleSetForViewing, (state, { article, sectionToScrollTo }) => ({
    ...state,
    selectedArticle: article,
    articleCurrently: article,
    sectionToScrollTo: sectionToScrollTo ?? null,
    isEditMode: false,
  })),

  on(ArticlesActions.articleSetForEditing, (state, { article }) => ({
    ...state,
    selectedArticle: article,
    articleCurrently: article,
    isEditMode: true,
  })),

  on(ArticlesActions.getArticleImageUrlSucceeded, (state, { imageUrl }) => ({
    ...state,
    selectedArticle: state.selectedArticle
      ? { ...state.selectedArticle, imageUrl }
      : null,
    articleCurrently: { ...state.articleCurrently, imageUrl },
  })),

  on(ArticlesActions.deleteArticleSelected, (state, { articleToDelete }) => ({
    ...state,
    selectedArticle: articleToDelete,
  })),

  on(ArticlesActions.deleteArticleSucceeded, (state, { deletedArticle }) => ({
    ...state,
    articles: state.articles.filter(article => article.id !== deletedArticle.id),
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

  on(ArticlesActions.newsScreenEntered, ArticlesActions.resetArticleForm, state => ({
    ...state,
    selectedArticle: initialState.selectedArticle,
    articleCurrently: initialState.articleCurrently,
    isEditMode: false,
  })),

  on(ArticlesActions.publishArticleSucceeded, (state, { article }) => ({
    ...state,
    articleCurrently: initialState.articleCurrently,
    isEditMode: false,
    articles: [...state.articles, article],
  })),

  on(ArticlesActions.updateArticleSucceeded, (state, { article }) => ({
    ...state,
    articleCurrently: initialState.articleCurrently,
    isEditMode: false,
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

  on(ArticlesActions.scrollToSection, state => ({
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
