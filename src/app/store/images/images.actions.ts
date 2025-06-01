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

export const fetchImagesForAlbumRequested = createAction(
  '[Images] Fetch images for album requested',
  props<{ album: string }>(),
);
export const fetchImagesForAlbumSucceeded = createAction(
  '[Images] Fetch images for album succeeded',
  props<{ images: Image[] }>(),
);
export const fetchImagesForAlbumFailed = createAction(
  '[Images] Fetch images for album failed',
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

export const addAnImageSelected = createAction('[Images] Add an image selected');

export const imageFileLoadSucceeded = createAction(
  '[Images] Image file load succeeded',
  props<{ numFiles: number }>(),
);
export const imageFileLoadFailed = createAction(
  '[Images] Image file load failed',
  props<{ error: LccError }>(),
);
export const largeImageFileDetected = createAction(
  '[Images] Large image file detected',
  props<{ fileSize: number }>(),
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

export const updateCoverImageRequested = createAction(
  '[Images] Update cover image requested',
  props<{ image: Image; album: string }>(),
);
export const updateCoverImageSucceeded = createAction(
  '[Images] Update cover image succeeded',
  props<{ baseImage: BaseImage }>(),
);
export const updateCoverImageFailed = createAction(
  '[Images] Update cover image failed',
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

export const cancelSelected = createAction('[Images] Cancel selected');

export const formValueChanged = createAction(
  '[Images] Form value changed',
  props<{ imageId: Id | null; value: Partial<ImageFormData> }>(),
);

export const imageFormDataCleared = createAction(
  '[Images] Image form data cleared',
  props<{ imageId: Id | null }>(),
);
