import { Action, createReducer, on } from '@ngrx/store';

import type { Article, ControlModes, Url } from '@app/types';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,

  on(ArticlesActions.articleAddRequested, state => ({
    ...state,
    controlMode: 'add' as ControlModes,
  })),

  on(ArticlesActions.articleEditRequested, state => ({
    ...state,
    controlMode: 'edit' as ControlModes,
  })),

  on(ArticlesActions.articleViewRequested, state => ({
    ...state,
    controlMode: 'view' as ControlModes,
  })),

  on(ArticlesActions.articleSet, (state, { article }) => ({
    ...state,
    setArticle: article,
  })),

  on(ArticlesActions.articleUnset, state => ({
    ...state,
    setArticle: null,
  })),

  on(
    ArticlesActions.cancelSelected,
    ArticlesActions.fetchArticleFailed,
    ArticlesActions.fetchArticlesFailed,
    ArticlesActions.deleteArticleFailed,
    ArticlesActions.deleteArticleCancelled,
    state => ({
      ...state,
      setArticle: null,
      formArticle: null,
      controlMode: 'view' as ControlModes,
    }),
  ),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }) => ({
      ...state,
      articles: [
        ...state.articles.map(storedArticle =>
          storedArticle.id === article.id ? article : storedArticle,
        ),
      ],
      setArticle: null,
      formArticle: null,
      controlMode: 'view' as ControlModes,
    }),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: [
      ...state.articles.map(storedArticle =>
        storedArticle.id === article.id ? article : storedArticle,
      ),
    ],
  })),

  on(ArticlesActions.getArticleImageUrlSucceeded, (state, { imageUrl }) => ({
    ...state,
    setArticle: updateSetArticleForImageUrlChange(state, imageUrl),
    formArticle: state.formArticle ? { ...state.formArticle, imageUrl } : null,
  })),

  on(ArticlesActions.getArticleImageFileSucceeded, (state, { imageFile }) => ({
    ...state,
    setArticle: updateSetArticleForImageFileChange(state, imageFile),
    formArticle: state.formArticle ? { ...state.formArticle, imageFile } : null,
  })),

  on(ArticlesActions.articleImageChangeReverted, state => ({
    ...state,
    formArticle: {
      ...state.formArticle!,
      imageFile: state.setArticle?.imageFile ?? null,
      imageUrl: state.setArticle?.imageUrl ?? null,
    },
  })),

  on(ArticlesActions.getArticleThumbnailImageUrlsSucceeded, (state, { articles }) => ({
    ...state,
    articles,
  })),

  on(ArticlesActions.deleteArticleSelected, (state, { article }) => ({
    ...state,
    setArticle: article,
  })),

  on(ArticlesActions.deleteArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: state.articles.filter(storedArticle => storedArticle.id !== article.id),
    formArticle: null,
    setArticle: null,
  })),

  on(ArticlesActions.formDataChanged, (state, { article }) => ({
    ...state,
    formArticle: article,
  })),
);

export function reducer(state: ArticlesState, action: Action): ArticlesState {
  return articlesReducer(state, action);
}

/**
 * If an image URL key exists in local storage, update the 'setArticle' value so
 * that the image change can be recognized as an unsaved change, to enable the unsaved
 * change modal that opens if the user tries to leave the route
 */
function updateSetArticleForImageUrlChange(
  state: ArticlesState,
  imageUrl: Url,
): Article | null {
  // eslint-disable-next-line no-prototype-builtins
  return localStorage.hasOwnProperty('imageUrl')
    ? state.setArticle
    : state.setArticle
      ? { ...state.setArticle, imageUrl }
      : null;
}

/**
 * Same as for image URLs. See: {@link updateSetArticleForImageUrlChange}
 */
function updateSetArticleForImageFileChange(
  state: ArticlesState,
  imageFile: File,
): Article | null {
  // eslint-disable-next-line no-prototype-builtins
  return localStorage.hasOwnProperty('imageUrl')
    ? state.setArticle
    : state.setArticle
      ? { ...state.setArticle, imageFile }
      : null;
}
