import { createAction, props } from '@ngrx/store';

import { HttpErrorResponse } from '@angular/common/http';

import type { Article, Id, Url } from '@app/types';

enum ArticlesActionTypes {
  FETCH_ARTICLES_REQUESTED = '[Articles] Fetch articles requested',
  FETCH_ARTICLES_SUCCEEDED = '[Articles] Fetch articles succeeded',
  FETCH_ARTICLES_FAILED = '[Articles] Fetch articles failed',

  ARTICLE_VIEW_REQUESTED = '[Articles] Article view requested',
  ARTICLE_ADD_REQUESTED = '[Articles] Article add requested',
  ARTICLE_EDIT_REQUESTED = '[Articles] Article edit requested',

  FETCH_ARTICLE_REQUESTED = '[Articles] Fetch article requested',
  FETCH_ARTICLE_SUCCEEDED = '[Articles] Fetch article succeeded',
  FETCH_ARTICLE_FAILED = '[Articles] Fetch article failed',

  ARTICLE_SET = '[Articles] Article set',
  ARTICLE_UNSET = '[Articles] Article unset',

  GET_ARTICLE_THUMBNAIL_IMAGE_URLS_REQUESTED = '[Articles] Get article thumbnail image URLs requested',
  GET_ARTICLE_THUMBNAIL_IMAGE_URLS_FAILED = '[Articles] Get article thumbnail image URLs failed',
  GET_ARTICLE_THUMBNAIL_IMAGE_URLS_SUCCEEDED = '[Articles] Get article thumbnail image URLs succeeded',

  GET_ARTICLE_IMAGE_URL_REQUESTED = '[Articles] Get article image URL requested',
  GET_ARTICLE_IMAGE_URL_FAILED = '[Articles] Get article image URL failed',
  GET_ARTICLE_IMAGE_URL_SUCCEEDED = '[Articles] Get article image URL succeeded',

  GET_ARTICLE_IMAGE_FILE_REQUESTED = '[Articles] Get article image file requested',
  GET_ARTICLE_IMAGE_FILE_FAILED = '[Articles] Get article image file failed',
  GET_ARTICLE_IMAGE_FILE_SUCCEEDED = '[Articles] Get article image file succeeded',
  ARTICLE_IMAGE_CHANGE_REVERTED = '[Articles] Article image change reverted',

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

  DELETE_ARTICLE_SELECTED = '[Articles] Delete article selected',
  DELETE_ARTICLE_CONFIRMED = '[Articles] Delete article confirmed',
  DELETE_ARTICLE_CANCELLED = '[Articles] Delete article cancelled',
  DELETE_ARTICLE_SUCCEEDED = '[Articles] Delete article succeeded',
  DELETE_ARTICLE_FAILED = '[Articles] Delete article failed',

  CANCEL_SELECTED = '[Articles] Cancel selected',
  CANCEL_CONFIRMED = '[Articles] Cancel confirmed',

  FORM_DATA_CHANGED = '[Articles] Form data changed',
}

export const fetchArticlesRequested = createAction(
  ArticlesActionTypes.FETCH_ARTICLES_REQUESTED,
);
export const fetchArticlesSucceeded = createAction(
  ArticlesActionTypes.FETCH_ARTICLES_SUCCEEDED,
  props<{ articles: Article[] }>(),
);
export const fetchArticlesFailed = createAction(
  ArticlesActionTypes.FETCH_ARTICLES_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const articleViewRequested = createAction(
  ArticlesActionTypes.ARTICLE_VIEW_REQUESTED,
  props<{ articleId: Id }>(),
);
export const articleAddRequested = createAction(
  ArticlesActionTypes.ARTICLE_ADD_REQUESTED,
);
export const articleEditRequested = createAction(
  ArticlesActionTypes.ARTICLE_EDIT_REQUESTED,
  props<{ articleId: Id }>(),
);

export const fetchArticleRequested = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_REQUESTED,
  props<{ articleId: Id }>(),
);
export const fetchArticleSucceeded = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_SUCCEEDED,
  props<{ article: Article }>(),
);
export const fetchArticleFailed = createAction(
  ArticlesActionTypes.FETCH_ARTICLE_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const articleSet = createAction(
  ArticlesActionTypes.ARTICLE_SET,
  props<{ article: Article }>(),
);
export const articleUnset = createAction(ArticlesActionTypes.ARTICLE_UNSET);

export const getArticleThumbnailImageUrlsRequested = createAction(
  ArticlesActionTypes.GET_ARTICLE_THUMBNAIL_IMAGE_URLS_REQUESTED,
  props<{ articles: Article[] }>(),
);
export const getArticleThumbnailImageUrlsSucceeded = createAction(
  ArticlesActionTypes.GET_ARTICLE_THUMBNAIL_IMAGE_URLS_SUCCEEDED,
  props<{ articles: Article[] }>(),
);
export const getArticleThumbnailImageUrlsFailed = createAction(
  ArticlesActionTypes.GET_ARTICLE_THUMBNAIL_IMAGE_URLS_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const getArticleImageUrlRequested = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_URL_REQUESTED,
  props<{ article?: Article }>(),
);
export const getArticleImageUrlSucceeded = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_URL_SUCCEEDED,
  props<{ article: Article }>(),
);
export const getArticleImageUrlFailed = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_URL_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const getArticleImageFileRequested = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_FILE_REQUESTED,
  props<{ imageUrl: Url }>(),
);
export const getArticleImageFileSucceeded = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_FILE_SUCCEEDED,
  props<{ imageFile: File }>(),
);
export const getArticleImageFileFailed = createAction(
  ArticlesActionTypes.GET_ARTICLE_IMAGE_FILE_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);
export const articleImageChangeReverted = createAction(
  ArticlesActionTypes.ARTICLE_IMAGE_CHANGE_REVERTED,
);

export const publishArticleSelected = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_SELECTED,
  props<{ article: Article }>(),
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
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const updateArticleSelected = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_SELECTED,
  props<{ article: Article }>(),
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
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const deleteArticleSelected = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_SELECTED,
  props<{ article: Article }>(),
);
export const deleteArticleConfirmed = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_CONFIRMED,
);
export const deleteArticleCancelled = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_CANCELLED,
);
export const deleteArticleSucceeded = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_SUCCEEDED,
  props<{ article: Article }>(),
);
export const deleteArticleFailed = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const cancelSelected = createAction(ArticlesActionTypes.CANCEL_SELECTED);

export const formDataChanged = createAction(
  ArticlesActionTypes.FORM_DATA_CHANGED,
  props<{ article: Article }>(),
);
