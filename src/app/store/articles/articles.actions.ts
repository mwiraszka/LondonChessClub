import { createAction, props } from '@ngrx/store';

import type { Article, Url } from '@app/types';

enum ArticlesActionTypes {
  FETCH_ARTICLES_REQUESTED = '[Articles] Fetch articles requested',
  FETCH_ARTICLES_SUCCEEDED = '[Articles] Fetch articles succeeded',
  FETCH_ARTICLES_FAILED = '[Articles] Fetch articles failed',

  FETCH_ARTICLE_FOR_VIEW_SCREEN_REQUESTED = '[Articles] Fetch article for view screen requested',
  FETCH_ARTICLE_FOR_VIEW_SCREEN_SUCCEEDED = '[Articles] Fetch article for view screen succeeded',
  FETCH_ARTICLE_FOR_VIEW_SCREEN_FAILED = '[Articles] Fetch article for view screen failed',
  ARTICLE_SET_FOR_VIEWING = '[Articles] Article set for viewing',

  FETCH_ARTICLE_FOR_EDIT_SCREEN_REQUESTED = '[Articles] Fetch article for edit screen requested',
  FETCH_ARTICLE_FOR_EDIT_SCREEN_SUCCEEDED = '[Articles] Fetch article for edit screen succeeded',
  FETCH_ARTICLE_FOR_EDIT_SCREEN_FAILED = '[Articles] Fetch article for edit screen failed',
  ARTICLE_SET_FOR_EDITING = '[Articles] Article set for editing',

  GET_ARTICLE_IMAGE_URL_FAILED = '[Articles] Get article image URL failed',
  GET_ARTICLE_IMAGE_URL_SUCCEEDED = '[Articles] Get article image URL succeeded',

  DELETE_ARTICLE_SELECTED = '[Articles] Delete article selected',
  DELETE_ARTICLE_CONFIRMED = '[Articles] Delete article confirmed',
  DELETE_ARTICLE_CANCELLED = '[Articles] Delete article cancelled',
  DELETE_ARTICLE_SUCCEEDED = '[Articles] Delete article succeeded',
  DELETE_ARTICLE_FAILED = '[Articles] Delete article failed',

  PUBLISH_ARTICLE_SELECTED = '[Articles] Publish article selected',
  PUBLISH_ARTICLE_CONFIRMED = '[Articles] Publish article confirmed',
  PUBLISH_ARTICLE_CANCELLED = '[Articles] Publish article cancelled',
  PUBLISH_ARTICLE_SUCCEEDED = '[Articles] Publish article succeeded',
  PUBLISH_ARTICLE_FAILED = '[Articles] Publish article failed',

  UPDATE_ARTICLE_SELECTED = '[Articles] Update article selected',
  UPDATE_ARTICLE_CONFIRMED = '[Articles] Update article confirmed',
  UPDATE_ARTICLE_CANCELLED = '[Articles] Update article cancelled',
  UPDATE_ARTICLE_SUCCEEDED = '[Articles] Update article succeeded',
  UPDATE_ARTICLE_FAILED = '[Articles] Update article failed',

  CANCEL_SELECTED = '[Articles] Cancel selected',
  CANCEL_CONFIRMED = '[Articles] Cancel confirmed',

  FORM_DATA_CHANGED = '[Articles] Form data changed',
  RESET_ARTICLE_FORM = '[Articles] Reset article form',

  SCROLL_TO_SECTION = '[Articles] Scroll to section',
}

export const fetchArticlesRequested = createAction(
  ArticlesActionTypes.FETCH_ARTICLES_REQUESTED,
);
export const fetchArticlesSucceeded = createAction(
  ArticlesActionTypes.FETCH_ARTICLES_SUCCEEDED,
  props<{ allArticles: Article[] }>(),
);
export const fetchArticlesFailed = createAction(
  ArticlesActionTypes.FETCH_ARTICLES_FAILED,
  props<{ error: Error }>(),
);

export const fetchArticleForViewScreenRequested = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_FOR_VIEW_SCREEN_REQUESTED,
  props<{ articleId: string }>(),
);
export const fetchArticleForViewScreenSucceeded = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_FOR_VIEW_SCREEN_SUCCEEDED,
  props<{ article: Article }>(),
);
export const fetchArticleForViewScreenFailed = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_FOR_VIEW_SCREEN_FAILED,
  props<{ error: Error }>(),
);
export const articleSetForViewing = createAction(
  ArticlesActionTypes.ARTICLE_SET_FOR_EDITING,
  props<{ article: Article; sectionToScrollTo?: string }>(),
);

export const fetchArticleForEditScreenRequested = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_FOR_EDIT_SCREEN_REQUESTED,
  props<{ articleId: string }>(),
);
export const fetchArticleForEditScreenSucceeded = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_FOR_EDIT_SCREEN_SUCCEEDED,
  props<{ article: Article }>(),
);
export const fetchArticleForEditScreenFailed = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_FOR_EDIT_SCREEN_FAILED,
  props<{ error: Error }>(),
);
export const articleSetForEditing = createAction(
  ArticlesActionTypes.ARTICLE_SET_FOR_EDITING,
  props<{ article: Article }>(),
);

export const getArticleImageUrlSucceeded = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_URL_SUCCEEDED,
  props<{ imageUrl: Url }>(),
);
export const getArticleImageUrlFailed = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_URL_FAILED,
  props<{ error: Error }>(),
);

export const deleteArticleSelected = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_SELECTED,
  props<{ articleToDelete: Article }>(),
);
export const deleteArticleConfirmed = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_CONFIRMED,
);
export const deleteArticleCancelled = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_CANCELLED,
);
export const deleteArticleSucceeded = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_SUCCEEDED,
  props<{ deletedArticle: Article }>(),
);
export const deleteArticleFailed = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_FAILED,
  props<{ error: Error }>(),
);

export const publishArticleSelected = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_SELECTED,
  props<{ articleToPublish: Article }>(),
);
export const publishArticleConfirmed = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_CONFIRMED,
);
export const publishArticleCancelled = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_CANCELLED,
);
export const publishArticleSucceeded = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_SUCCEEDED,
  props<{ article: Article }>(),
);
export const publishArticleFailed = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_FAILED,
  props<{ error: Error }>(),
);

export const updateArticleSelected = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_SELECTED,
  props<{ articleToUpdate: Article }>(),
);
export const updateArticleConfirmed = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_CONFIRMED,
);
export const updateArticleCancelled = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_CANCELLED,
);
export const updateArticleSucceeded = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_SUCCEEDED,
  props<{ article: Article }>(),
);
export const updateArticleFailed = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_FAILED,
  props<{ error: Error }>(),
);

export const cancelSelected = createAction(ArticlesActionTypes.CANCEL_SELECTED);
export const cancelConfirmed = createAction(ArticlesActionTypes.CANCEL_CONFIRMED);

export const formDataChanged = createAction(
  ArticlesActionTypes.FORM_DATA_CHANGED,
  props<{ article: Article }>(),
);
export const resetArticleForm = createAction(ArticlesActionTypes.RESET_ARTICLE_FORM);

export const scrollToSection = createAction(ArticlesActionTypes.SCROLL_TO_SECTION);
