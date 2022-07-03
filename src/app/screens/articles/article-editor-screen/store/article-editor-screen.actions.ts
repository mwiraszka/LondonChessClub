import { createAction, props } from '@ngrx/store';

import { Article } from '../../types/article.model';

enum ArticleEditorScreenActionTypes {
  ARTICLE_TO_EDIT_RECEIVED = '[Article Editor Screen] Article to edit received',
  GET_ARTICLE_TO_EDIT_SUCCEEDED = '[Article Editor Screen] Get article to edit succeeded',
  RESET_ARTICLE_FORM = '[Article Editor Screen] Reset article form',

  PUBLISH_ARTICLE_SELECTED = '[Article Editor Screen] Publish article selected',
  PUBLISH_ARTICLE_CONFIRMED = '[Article Editor Screen] Publish article confirmed',
  PUBLISH_ARTICLE_CANCELLED = '[Article Editor Screen] Publish article cancelled',
  PUBLISH_ARTICLE_SUCCEEDED = '[Article Editor Screen] Publish article succeeded',
  PUBLISH_ARTICLE_FAILED = '[Article Editor Screen] Publish article failed',

  UPDATE_ARTICLE_SELECTED = '[Article Editor Screen] Update article selected',
  UPDATE_ARTICLE_CONFIRMED = '[Article Editor Screen] Update article confirmed',
  UPDATE_ARTICLE_CANCELLED = '[Article Editor Screen] Update article cancelled',
  UPDATE_ARTICLE_SUCCEEDED = '[Article Editor Screen] Update article succeeded',
  UPDATE_ARTICLE_FAILED = '[Article Editor Screen] Update article failed',

  CANCEL_SELECTED = '[Article Editor Screen] Cancel selected',
  CANCEL_CONFIRMED = '[Article Editor Screen] Cancel confirmed',

  FORM_DATA_CHANGED = '[Article Editor Screen] Form data changed',
}

export const articleToEditReceived = createAction(
  ArticleEditorScreenActionTypes.ARTICLE_TO_EDIT_RECEIVED,
  props<{ articleToEdit: Article }>()
);
export const getArticleToEditSucceeded = createAction(
  ArticleEditorScreenActionTypes.GET_ARTICLE_TO_EDIT_SUCCEEDED,
  props<{ articleToEdit: Article }>()
);
export const resetArticleForm = createAction(
  ArticleEditorScreenActionTypes.RESET_ARTICLE_FORM
);

export const publishArticleSelected = createAction(
  ArticleEditorScreenActionTypes.PUBLISH_ARTICLE_SELECTED,
  props<{ articleToPublish: Article }>()
);
export const publishArticleConfirmed = createAction(
  ArticleEditorScreenActionTypes.PUBLISH_ARTICLE_CONFIRMED
);
export const publishArticleCancelled = createAction(
  ArticleEditorScreenActionTypes.PUBLISH_ARTICLE_CANCELLED
);
export const publishArticleSucceeded = createAction(
  ArticleEditorScreenActionTypes.PUBLISH_ARTICLE_SUCCEEDED,
  props<{ publishedArticle: Article }>()
);
export const publishArticleFailed = createAction(
  ArticleEditorScreenActionTypes.PUBLISH_ARTICLE_FAILED,
  props<{ error: Error }>()
);

export const updateArticleSelected = createAction(
  ArticleEditorScreenActionTypes.UPDATE_ARTICLE_SELECTED,
  props<{ articleToUpdate: Article }>()
);
export const updateArticleConfirmed = createAction(
  ArticleEditorScreenActionTypes.UPDATE_ARTICLE_CONFIRMED
);
export const updateArticleCancelled = createAction(
  ArticleEditorScreenActionTypes.UPDATE_ARTICLE_CANCELLED
);
export const updateArticleSucceeded = createAction(
  ArticleEditorScreenActionTypes.UPDATE_ARTICLE_SUCCEEDED,
  props<{ updatedArticle: Article }>()
);
export const updateArticleFailed = createAction(
  ArticleEditorScreenActionTypes.UPDATE_ARTICLE_FAILED,
  props<{ error: Error }>()
);

export const cancelSelected = createAction(
  ArticleEditorScreenActionTypes.CANCEL_SELECTED
);
export const cancelConfirmed = createAction(
  ArticleEditorScreenActionTypes.CANCEL_CONFIRMED
);

export const formDataChanged = createAction(
  ArticleEditorScreenActionTypes.FORM_DATA_CHANGED,
  props<{ formData: Article }>()
);
