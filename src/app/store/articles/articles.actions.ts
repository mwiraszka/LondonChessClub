import { createAction, props } from '@ngrx/store';

import { HttpErrorResponse } from '@angular/common/http';

import type { Article, ArticleFormData, ControlMode, Id } from '@app/types';

export const fetchArticlesRequested = createAction('[Articles] Fetch articles requested');
export const fetchArticlesSucceeded = createAction(
  '[Articles] Fetch articles succeeded',
  props<{ articles: Article[] }>(),
);
export const fetchArticlesFailed = createAction(
  '[Articles] Fetch articles failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const fetchArticleRequested = createAction(
  '[Articles] Fetch article requested',
  props<{ controlMode: ControlMode; articleId?: Id }>(),
);
export const newArticleFormTemplateLoaded = createAction(
  '[Articles] New article form template loaded',
);
export const fetchArticleSucceeded = createAction(
  '[Articles] Fetch article succeeded',
  props<{ article: Article }>(),
);
export const fetchArticleFailed = createAction(
  '[Articles] Fetch article failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const publishArticleSelected = createAction(
  '[Articles] Publish article selected',
  props<{ articleTitle: string }>(),
);
export const publishArticleConfirmed = createAction(
  '[Articles] Publish article confirmed',
);
export const publishArticleCancelled = createAction(
  '[Articles] Publish article cancelled',
);
export const publishArticleSucceeded = createAction(
  '[Articles] Publish article succeeded',
  props<{ article: Article }>(),
);
export const publishArticleFailed = createAction(
  '[Articles] Publish article failed',
  props<{ error: Error }>(),
);

export const updateArticleSelected = createAction(
  '[Articles] Update article selected',
  props<{ articleTitle: string }>(),
);
export const updateArticleConfirmed = createAction('[Articles] Update article confirmed');
export const updateArticleCancelled = createAction('[Articles] Update article cancelled');
export const updateArticleSucceeded = createAction(
  '[Articles] Update article succeeded',
  props<{ article: Article }>(),
);
export const updateArticleFailed = createAction(
  '[Articles] Update article failed',
  props<{ error: Error }>(),
);

export const deleteArticleSelected = createAction(
  '[Articles] Delete article selected',
  props<{ article: Article }>(),
);
export const deleteArticleConfirmed = createAction('[Articles] Delete article confirmed');
export const deleteArticleCancelled = createAction('[Articles] Delete article cancelled');
export const deleteArticleSucceeded = createAction(
  '[Articles] Delete article succeeded',
  props<{ article: Article }>(),
);
export const deleteArticleFailed = createAction(
  '[Articles] Delete article failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const cancelSelected = createAction('[Articles] Cancel selected');

export const formValueChanged = createAction(
  '[Articles] Form value changed',
  props<{ value: Partial<ArticleFormData> }>(),
);
export const newImageStored = createAction('[Articles] New image stored');
export const storedImageRemoved = createAction('[Articles] Stored image removed');

export const articleUnset = createAction('[Articles] Article unset');
