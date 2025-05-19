import { createAction, props } from '@ngrx/store';

import type { Id, Image, LccError, Url } from '@app/models';

export const fetchArticleBannerImageThumbnailsRequested = createAction(
  '[Images] Fetch article banner image thumbnails requested',
);
export const fetchArticleBannerImageThumbnailsSucceeded = createAction(
  '[Images] Fetch article banner image thumbnails succeeded',
  props<{ images: Image[] }>(),
);
export const fetchArticleBannerImageThumbnailsFailed = createAction(
  '[Images] Fetch article banner image thumbnails failed',
  props<{ error: LccError }>(),
);

export const fetchArticleBannerImageRequested = createAction(
  '[Images] Fetch article banner image requested',
  props<{ imageId: Id; setAsOriginal?: boolean }>(),
);
export const fetchArticleBannerImageSucceeded = createAction(
  '[Images] Fetch article banner image succeeded',
  props<{ articleId: Id; image: Image; setAsOriginal?: boolean }>(),
);
export const fetchArticleBannerImageFailed = createAction(
  '[Images] Fetch article banner image failed',
  props<{ error: LccError }>(),
);

export const addImageRequested = createAction(
  '[Images] Add image requested',
  props<{ dataUrl: Url; filename: string; caption: string; forArticle: boolean }>(),
);
export const addImageSucceeded = createAction(
  '[Images] Add image succeeded',
  props<{ image: Image; forArticle: boolean }>(),
);
export const addImageFailed = createAction(
  '[Images] Add image failed',
  props<{ error: LccError }>(),
);

export const deleteImageRequested = createAction(
  '[Images] Delete image requested',
  props<{ image: Image }>(),
);
export const deleteImageSucceeded = createAction(
  '[Images] Delete image succeeded',
  props<{ image: Image }>(),
);
export const deleteImageFailed = createAction(
  '[Images] Delete image failed',
  props<{ error: LccError }>(),
);
