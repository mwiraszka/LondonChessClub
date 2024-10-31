import { Action, createReducer, on } from '@ngrx/store';

import { type Article, ControlModes, type Url } from '@app/types';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,

  on(ArticlesActions.setArticle, (state, { article, controlMode }) => ({
    ...state,
    selectedArticle: article,
    formArticle: controlMode === ControlModes.VIEW ? null : article,
    controlMode,
  })),

  on(
    ArticlesActions.cancelSelected,
    ArticlesActions.fetchArticleFailed,
    ArticlesActions.deleteArticleFailed,
    ArticlesActions.deleteArticleCancelled,
    state => ({
      ...state,
      selectedArticle: null,
      formArticle: null,
      controlMode: ControlModes.VIEW,
    }),
  ),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }) => ({
      ...state,
      articles: getSortedArticles([
        ...state.articles.filter(storedArticle => storedArticle.id !== article.id),
        article,
      ]),
      selectedArticle: null,
      formArticle: null,
      controlMode: ControlModes.VIEW,
    }),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: [
      ...state.articles.filter(storedArticle => storedArticle.id !== article.id),
      article,
    ],
  })),

  on(ArticlesActions.getArticleImageUrlSucceeded, (state, { imageUrl }) => ({
    ...state,
    selectedArticle: updateSelectedArticleForImageUrlChange(state, imageUrl),
    formArticle: state.formArticle ? { ...state.formArticle, imageUrl } : null,
  })),

  on(ArticlesActions.getArticleImageFileSucceeded, (state, { imageFile }) => ({
    ...state,
    selectedArticle: updateSelectedArticleForImageFileChange(state, imageFile),
    formArticle: state.formArticle ? { ...state.formArticle, imageFile } : null,
  })),

  on(ArticlesActions.revertArticleImageChange, state => ({
    ...state,
    formArticle: {
      ...state.formArticle!,
      imageFile: state.selectedArticle?.imageFile ?? null,
      imageUrl: state.selectedArticle?.imageUrl ?? null,
    },
  })),

  on(ArticlesActions.getArticleThumbnailImageUrlsSucceeded, (state, { articles }) => ({
    ...state,
    articles: getSortedArticles(articles),
  })),

  on(ArticlesActions.deleteArticleSelected, (state, { article }) => ({
    ...state,
    selectedArticle: article,
  })),

  on(ArticlesActions.deleteArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: state.articles.filter(storedArticle => storedArticle.id !== article.id),
    formArticle: null,
    selectedArticle: null,
  })),

  on(ArticlesActions.formDataChanged, (state, { article }) => ({
    ...state,
    formArticle: article,
  })),
);

export function reducer(state: ArticlesState, action: Action): ArticlesState {
  return articlesReducer(state, action);
}

function getSortedArticles(articles: Article[]): Article[] {
  const stickyArticles = articles
    .filter(article => article.isSticky)
    .sort(customSort('modificationInfo.dateCreated', false));
  const remainingArticles = articles
    .filter(article => !article.isSticky)
    .sort(customSort('modificationInfo.dateCreated', false));

  return [...stickyArticles, ...remainingArticles];
}

/**
 * If an image URL key exists in local storage, update the 'selectedArticle' value so
 * that the image change can be recognized as an unsaved change, to enable the unsaved
 * change modal that opens if the user tries to leave the route
 */
function updateSelectedArticleForImageUrlChange(
  state: ArticlesState,
  imageUrl: Url,
): Article | null {
  // eslint-disable-next-line no-prototype-builtins
  return localStorage.hasOwnProperty('imageUrl')
    ? state.selectedArticle
    : state.selectedArticle
      ? { ...state.selectedArticle, imageUrl }
      : null;
}

/**
 * Same as for image URLs. See: {@link updateSelectedArticleForImageUrlChange}
 */
function updateSelectedArticleForImageFileChange(
  state: ArticlesState,
  imageFile: File,
): Article | null {
  // eslint-disable-next-line no-prototype-builtins
  return localStorage.hasOwnProperty('imageUrl')
    ? state.selectedArticle
    : state.selectedArticle
      ? { ...state.selectedArticle, imageFile }
      : null;
}
