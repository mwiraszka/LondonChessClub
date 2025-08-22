import { createAction, props } from '@ngrx/store';

import {
  Article,
  ArticleFormData,
  DataPaginationOptions,
  Id,
  LccError,
} from '@app/models';

export const fetchHomePageArticlesRequested = createAction(
  '[Articles] Fetch home page articles requested',
);
export const fetchHomePageArticlesSucceeded = createAction(
  '[Articles] Fetch home page articles succeeded',
  props<{ articles: Article[] }>(),
);
export const fetchHomePageArticlesFailed = createAction(
  '[Articles] Fetch home page articles failed',
  props<{ error: LccError }>(),
);

export const fetchNewsPageArticlesRequested = createAction(
  '[Articles] Fetch news page articles requested',
);
export const fetchNewsPageArticlesSucceeded = createAction(
  '[Articles] Fetch news page articles succeeded',
  props<{ articles: Article[]; filteredCount: number; totalCount: number }>(),
);
export const fetchNewsPageArticlesFailed = createAction(
  '[Articles] Fetch news page articles failed',
  props<{ error: LccError }>(),
);

export const fetchArticleRequested = createAction(
  '[Articles] Fetch article requested',
  props<{ articleId: Id }>(),
);
export const fetchArticleSucceeded = createAction(
  '[Articles] Fetch article succeeded',
  props<{ article: Article }>(),
);
export const fetchArticleFailed = createAction(
  '[Articles] Fetch article failed',
  props<{ error: LccError }>(),
);

export const createAnArticleSelected = createAction(
  '[Articles] Create an article selected',
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

export const updateArticleBookmarkRequested = createAction(
  '[Articles] Update article bookmark requested',
  props<{ articleId: Id; bookmark: boolean }>(),
);
export const updateArticleRequested = createAction(
  '[Articles] Update article requested',
  props<{ articleId: Id }>(),
);
export const updateArticleSucceeded = createAction(
  '[Articles] Update article succeeded',
  props<{ article: Article; originalArticleTitle: string }>(),
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
  props<{ articleId: Id; articleTitle: string }>(),
);
export const deleteArticleFailed = createAction(
  '[Articles] Delete article failed',
  props<{ error: LccError }>(),
);

export const paginationOptionsChanged = createAction(
  '[Articles] Pagination options changed',
  props<{ options: DataPaginationOptions<Article>; fetch: boolean }>(),
);

export const cancelSelected = createAction('[Articles] Cancel selected');

export const formValueChanged = createAction(
  '[Articles] Form value changed',
  props<{ articleId: Id | null; value: Partial<ArticleFormData> }>(),
);

export const articleFormDataReset = createAction(
  '[Articles] Article form data reset',
  props<{ articleId: Id | null }>(),
);
