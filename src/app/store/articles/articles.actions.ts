import { createAction, props } from '@ngrx/store';

import { Article } from '@app/types';

enum ArticlesActionTypes {
  LOAD_ARTICLES_STARTED = '[Articles] Load articles started',
  LOAD_ARTICLES_SUCCEEDED = '[Articles] Load articles succeeded',
  LOAD_ARTICLES_FAILED = '[Articles] Load articles failed',

  CREATE_ARTICLE_SELECTED = '[Articles] Create article selected',
  EDIT_ARTICLE_SELECTED = '[Articles] Edit article selected',

  DELETE_ARTICLE_SELECTED = '[Articles] Delete article selected',
  DELETE_ARTICLE_CONFIRMED = '[Articles] Delete article confirmed',
  DELETE_ARTICLE_CANCELLED = '[Articles] Delete article cancelled',
  DELETE_ARTICLE_SUCCEEDED = '[Articles] Delete article succeeded',
  DELETE_ARTICLE_FAILED = '[Articles] Delete article failed',

  ARTICLE_TO_EDIT_RECEIVED = '[Articles] Article to edit received',
  GET_ARTICLE_TO_EDIT_SUCCEEDED = '[Articles] Get article to edit succeeded',
  RESET_ARTICLE_FORM = '[Articles] Reset article form',

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
}

export const loadArticlesStarted = createAction(
  ArticlesActionTypes.LOAD_ARTICLES_STARTED
);
export const loadArticlesSucceeded = createAction(
  ArticlesActionTypes.LOAD_ARTICLES_SUCCEEDED,
  props<{ allArticles: Article[] }>()
);
export const loadArticlesFailed = createAction(
  ArticlesActionTypes.LOAD_ARTICLES_FAILED,
  props<{ error: Error }>()
);

export const createArticleSelected = createAction(
  ArticlesActionTypes.CREATE_ARTICLE_SELECTED
);
export const editArticleSelected = createAction(
  ArticlesActionTypes.EDIT_ARTICLE_SELECTED,
  props<{ articleToEdit: Article }>()
);

export const deleteArticleSelected = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_SELECTED,
  props<{ articleToDelete: Article }>()
);
export const deleteArticleConfirmed = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_CONFIRMED
);
export const deleteArticleCancelled = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_CANCELLED
);
export const deleteArticleSucceeded = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_SUCCEEDED,
  props<{ deletedArticle: Article }>()
);
export const deleteArticleFailed = createAction(
  ArticlesActionTypes.DELETE_ARTICLE_FAILED,
  props<{ error: Error }>()
);

export const getArticleToEditSucceeded = createAction(
  ArticlesActionTypes.GET_ARTICLE_TO_EDIT_SUCCEEDED,
  props<{ articleToEdit: Article }>()
);
export const resetArticleForm = createAction(ArticlesActionTypes.RESET_ARTICLE_FORM);

export const publishArticleSelected = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_SELECTED,
  props<{ articleToPublish: Article }>()
);
export const publishArticleConfirmed = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_CONFIRMED
);
export const publishArticleCancelled = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_CANCELLED
);
export const publishArticleSucceeded = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_SUCCEEDED,
  props<{ publishedArticle: Article }>()
);
export const publishArticleFailed = createAction(
  ArticlesActionTypes.PUBLISH_ARTICLE_FAILED,
  props<{ error: Error }>()
);

export const updateArticleSelected = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_SELECTED,
  props<{ articleToUpdate: Article }>()
);
export const updateArticleConfirmed = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_CONFIRMED
);
export const updateArticleCancelled = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_CANCELLED
);
export const updateArticleSucceeded = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_SUCCEEDED,
  props<{ updatedArticle: Article }>()
);
export const updateArticleFailed = createAction(
  ArticlesActionTypes.UPDATE_ARTICLE_FAILED,
  props<{ error: Error }>()
);

export const cancelSelected = createAction(ArticlesActionTypes.CANCEL_SELECTED);
export const cancelConfirmed = createAction(ArticlesActionTypes.CANCEL_CONFIRMED);

export const formDataChanged = createAction(
  ArticlesActionTypes.FORM_DATA_CHANGED,
  props<{ article: Article }>()
);
