import { createAction, props } from '@ngrx/store';

import type { Article, ArticleFormData, ControlMode, Id, LccError } from '@app/types';

export const fetchArticlesRequested = createAction('[Articles] Fetch articles requested');
export const fetchArticlesSucceeded = createAction(
  '[Articles] Fetch articles succeeded',
  props<{ articles: Article[] }>(),
);
export const fetchArticlesFailed = createAction(
  '[Articles] Fetch articles failed',
  props<{ error: LccError }>(),
);

export const newArticleRequested = createAction('[Articles] New article requested');
export const fetchArticleRequested = createAction(
  '[Articles] Fetch article requested',
  props<{ controlMode: ControlMode; articleId: Id }>(),
);
export const fetchArticleSucceeded = createAction(
  '[Articles] Fetch article succeeded',
  props<{ article: Article }>(),
);
export const fetchArticleFailed = createAction(
  '[Articles] Fetch article failed',
  props<{ error: LccError }>(),
);

export const publishArticleRequested = createAction(
  '[Articles] Publish article requested',
);
export const publishArticleSucceeded = createAction(
  '[Articles] Publish article succeeded',
  props<{ article: Article }>(),
);
export const publishArticleFailed = createAction(
  '[Articles] Publish article failed',
  props<{ error: LccError }>(),
);

export const updateActicleBookmarkRequested = createAction(
  '[Articles] Update article bookmark requested',
  props<{ articleId: Id; bookmark: boolean }>(),
);
export const updateArticleRequested = createAction('[Articles] Update article requested');
export const updateArticleSucceeded = createAction(
  '[Articles] Update article succeeded',
  props<{ article: Article; originalArticleTitle?: string }>(),
);
export const updateArticleFailed = createAction(
  '[Articles] Update article failed',
  props<{ error: LccError }>(),
);

export const deleteArticleRequested = createAction(
  '[Articles] Delete article requested',
  props<{ article: Article }>(),
);
export const deleteArticleSucceeded = createAction(
  '[Articles] Delete article succeeded',
  props<{ article: Article }>(),
);
export const deleteArticleFailed = createAction(
  '[Articles] Delete article failed',
  props<{ error: LccError }>(),
);

export const cancelSelected = createAction('[Articles] Cancel selected');

export const formValueChanged = createAction(
  '[Articles] Form value changed',
  props<{ value: Partial<ArticleFormData> }>(),
);
export const newImageStored = createAction('[Articles] New image stored');
export const storedImageRemoved = createAction('[Articles] Stored image removed');

export const articleUnset = createAction('[Articles] Article unset');
