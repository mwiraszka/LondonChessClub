import { createAction, props } from '@ngrx/store';

import type { Id, Image, LccError } from '@app/models';

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
  props<{ imageId: Id }>(),
);
export const fetchArticleBannerImageSucceeded = createAction(
  '[Images] Fetch article banner image succeeded',
  props<{ image: Image }>(),
);
export const fetchArticleBannerImageFailed = createAction(
  '[Images] Fetch article banner image failed',
  props<{ error: LccError }>(),
);

export const addImageRequested = createAction('[Images] Add image requested');
export const addImageSucceeded = createAction(
  '[Images] Add image succeeded',
  props<{ image: Image }>(),
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

export const newImageStored = createAction('[Images] New image stored');
export const storedImageRemoved = createAction('[Images] Stored image removed');
