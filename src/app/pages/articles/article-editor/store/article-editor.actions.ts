import { createAction, props } from '@ngrx/store';

import { Article } from '../../types/article.model';

enum ArticleEditorActionTypes {
  ARTICLE_TO_EDIT_RECEIVED = '[Article Editor] Article to edit received',
  GET_ARTICLE_TO_EDIT_SUCCEEDED = '[Article Editor] Get article to edit succeeded',
  RESET_ARTICLE_FORM = '[Article Editor] Reset article form',

  PUBLISH_ARTICLE_SELECTED = '[Article Editor] Publish article selected',
  PUBLISH_ARTICLE_CONFIRMED = '[Article Editor] Publish article confirmed',
  PUBLISH_ARTICLE_CANCELLED = '[Article Editor] Publish article cancelled',
  PUBLISH_ARTICLE_SUCCEEDED = '[Article Editor] Publish article succeeded',
  PUBLISH_ARTICLE_FAILED = '[Article Editor] Publish article failed',

  UPDATE_ARTICLE_SELECTED = '[Article Editor] Update article selected',
  UPDATE_ARTICLE_CONFIRMED = '[Article Editor] Update article confirmed',
  UPDATE_ARTICLE_CANCELLED = '[Article Editor] Update article cancelled',
  UPDATE_ARTICLE_SUCCEEDED = '[Article Editor] Update article succeeded',
  UPDATE_ARTICLE_FAILED = '[Article Editor] Update article failed',

  CANCEL_SELECTED = '[Article Editor] Cancel selected',
  CANCEL_CONFIRMED = '[Article Editor] Cancel confirmed',

  FORM_DATA_CHANGED = '[Article Editor] Form data changed',
}

export const articleToEditReceived = createAction(
  ArticleEditorActionTypes.ARTICLE_TO_EDIT_RECEIVED,
  props<{ articleToEdit: Article }>()
);
export const getArticleToEditSucceeded = createAction(
  ArticleEditorActionTypes.GET_ARTICLE_TO_EDIT_SUCCEEDED,
  props<{ articleToEdit: Article }>()
);
export const resetArticleForm = createAction(ArticleEditorActionTypes.RESET_ARTICLE_FORM);

export const publishArticleSelected = createAction(
  ArticleEditorActionTypes.PUBLISH_ARTICLE_SELECTED,
  props<{ articleToPublish: Article }>()
);
export const publishArticleConfirmed = createAction(
  ArticleEditorActionTypes.PUBLISH_ARTICLE_CONFIRMED
);
export const publishArticleCancelled = createAction(
  ArticleEditorActionTypes.PUBLISH_ARTICLE_CANCELLED
);
export const publishArticleSucceeded = createAction(
  ArticleEditorActionTypes.PUBLISH_ARTICLE_SUCCEEDED,
  props<{ publishedArticle: Article }>()
);
export const publishArticleFailed = createAction(
  ArticleEditorActionTypes.PUBLISH_ARTICLE_FAILED,
  props<{ errorMessage: string }>()
);

export const updateArticleSelected = createAction(
  ArticleEditorActionTypes.UPDATE_ARTICLE_SELECTED,
  props<{ articleToUpdate: Article }>()
);
export const updateArticleConfirmed = createAction(
  ArticleEditorActionTypes.UPDATE_ARTICLE_CONFIRMED
);
export const updateArticleCancelled = createAction(
  ArticleEditorActionTypes.UPDATE_ARTICLE_CANCELLED
);
export const updateArticleSucceeded = createAction(
  ArticleEditorActionTypes.UPDATE_ARTICLE_SUCCEEDED,
  props<{ updatedArticle: Article }>()
);
export const updateArticleFailed = createAction(
  ArticleEditorActionTypes.UPDATE_ARTICLE_FAILED,
  props<{ errorMessage: string }>()
);

export const cancelSelected = createAction(ArticleEditorActionTypes.CANCEL_SELECTED);
export const cancelConfirmed = createAction(ArticleEditorActionTypes.CANCEL_CONFIRMED);

export const formDataChanged = createAction(
  ArticleEditorActionTypes.FORM_DATA_CHANGED,
  props<{ formData: Article }>()
);
