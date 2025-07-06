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

export const fetchImagesRequested = createAction(
  '[Images] Fetch images requested',
  props<{ imageIds: Id[] }>(),
);
export const fetchImagesSucceeded = createAction(
  '[Images] Fetch images succeeded',
  props<{ images: Image[] }>(),
);
export const fetchImagesFailed = createAction(
  '[Images] Fetch images failed',
  props<{ error: LccError }>(),
);

export const addAnImageSelected = createAction('[Images] Add an image selected');

export const addImageRequested = createAction(
  '[Images] Add image requested',
  props<{ imageId: Id }>(),
);
export const addImageSucceeded = createAction(
  '[Images] Add image succeeded',
  props<{ image: Image }>(),
);
export const addImageFailed = createAction(
  '[Images] Add image failed',
  props<{ error: LccError }>(),
);

export const addImagesRequested = createAction('[Images] Add images requested');
export const addImagesSucceeded = createAction(
  '[Images] Add images succeeded',
  props<{ images: Image[] }>(),
);
export const addImagesFailed = createAction(
  '[Images] Add images failed',
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
  props<{ baseImage: BaseImage; error: LccError }>(),
);

export const updateAlbumRequested = createAction(
  '[Images] Update album requested',
  props<{ album: string }>(),
);
export const updateAlbumSucceeded = createAction(
  '[Images] Update album images succeeded',
  props<{ album: string; baseImages: BaseImage[] }>(),
);
export const updateAlbumFailed = createAction(
  '[Images] Update images failed',
  props<{ album: string; error: LccError }>(),
);

export const automaticAlbumCoverSwitchSucceeded = createAction(
  '[Images] Automatic album cover switch succeeded',
  props<{ baseImage: BaseImage }>(),
);
export const automaticAlbumCoverSwitchFailed = createAction(
  '[Images] Automatic album cover switch failed',
  props<{ album: string; error: LccError }>(),
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
  props<{ image: Image; error: LccError }>(),
);

export const deleteAlbumRequested = createAction(
  '[Images] Delete album requested',
  props<{ album: string; imageIds: Id[] }>(),
);
export const deleteAlbumSucceeded = createAction(
  '[Images] Delete album succeeded',
  props<{ album: string; imageIds: Id[] }>(),
);
export const deleteAlbumFailed = createAction(
  '[Images] Delete album failed',
  props<{ album: string; error: LccError }>(),
);

export const cancelSelected = createAction('[Images] Cancel selected');

export const formValueChanged = createAction(
  '[Images] Form value changed',
  props<{ values: (Partial<ImageFormData> & { id: Id })[] }>(),
);

export const formDataReset = createAction(
  '[Images] Form data reset',
  props<{ imageIds: Id[] }>(),
);

export const imageFileActionFailed = createAction(
  '[Images] Image file action failed',
  props<{ error: LccError }>(),
);
