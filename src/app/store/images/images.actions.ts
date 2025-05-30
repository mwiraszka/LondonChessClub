import { createAction, props } from '@ngrx/store';

import type { Id, Image, ImageFormData, LccError } from '@app/models';
import { BaseImage } from '@app/models/image.model';

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
  props<{ baseImage: BaseImage; dataUrl: string }>(),
);
export const addImageSucceeded = createAction(
  '[Images] Add image succeeded',
  props<{ image: Image }>(),
);
export const addImageFailed = createAction(
  '[Images] Add image failed',
  props<{ error: LccError }>(),
);

export const updateImageRequested = createAction(
  '[Images] Update image requested',
  props<{ imageId: Id }>(),
);
export const updateImageSucceeded = createAction(
  '[Images] Update image succeeded',
  props<{ baseImage: BaseImage }>(),
);
export const updateImageFailed = createAction(
  '[Images] Update image failed',
  props<{ error: LccError }>(),
);

export const deleteImageRequested = createAction(
  '[Images] Delete image requested',
  props<{ image: Image }>(),
);
export const deleteImageSucceeded = createAction(
  '[Images] Delete image succeeded',
  props<{ imageId: Id; imageFilename: string }>(),
);
export const deleteImageFailed = createAction(
  '[Images] Delete image failed',
  props<{ error: LccError }>(),
);

export const cancelSelected = createAction('[Images] Cancel selected');

export const formValueChanged = createAction(
  '[Images] Form value changed',
  props<{ imageId: Id; value: Partial<ImageFormData> }>(),
);
