import { createAction, props } from '@ngrx/store';

import type { Id, Image, LccError, Url } from '@app/models';

export const fetchImageThumbnailsRequested = createAction(
  '[Images] Fetch image thumbnails requested',
);
export const fetchImageThumbnailsSucceeded = createAction(
  '[Images] Fetch image thumbnails succeeded',
  props<{ images: Image[] }>(),
);
export const fetchImageThumbnailsFailed = createAction(
  '[Images] Fetch image thumbnails failed',
  props<{ error: LccError }>(),
);

export const fetchImageRequested = createAction(
  '[Images] Fetch image requested',
  props<{ imageId: Id }>(),
);
export const fetchImageSucceeded = createAction(
  '[Images] Fetch image succeeded',
  props<{ image: Image }>(),
);
export const fetchImageFailed = createAction(
  '[Images] Fetch image failed',
  props<{ error: LccError }>(),
);

export const imageFileLoadSucceeded = createAction(
  '[Images] Image file load succeeded',
  props<{ numFiles: number }>(),
);
export const imageFileLoadFailed = createAction(
  '[Images] Image file load failed',
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
