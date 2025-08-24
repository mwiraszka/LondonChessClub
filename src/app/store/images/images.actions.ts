import { createAction, props } from '@ngrx/store';

import {
  DataPaginationOptions,
  Id,
  Image,
  ImageFormData,
  ImageRequestKind,
  LccError,
} from '@app/models';
import { BaseImage } from '@app/models/image.model';

export const imageRequestStarted = createAction(
  '[Images] Image request started',
  props<{ kind: ImageRequestKind; requestId: string; startedAt: number }>(),
);

export const imageRequestFinished = createAction(
  '[Images] Image request finished',
  props<{ kind: ImageRequestKind; requestId: string }>(),
);

export const imageRequestTimedOut = createAction(
  '[Images] Image request timed out',
  props<{ kind: ImageRequestKind; requestId: string; timeoutMs: number }>(),
);

export const fetchAllImagesMetadataRequested = createAction(
  '[Images] Fetch all images metadata requested',
);
export const fetchAllImagesMetadataSucceeded = createAction(
  '[Images] Fetch all images metadata succeeded',
  props<{ images: BaseImage[] }>(),
);
export const fetchAllImagesMetadataFailed = createAction(
  '[Images] Fetch all images metadata failed',
  props<{ error: LccError }>(),
);

export const fetchFilteredThumbnailsRequested = createAction(
  '[Images] Fetch filtered thumbnails requested',
);
export const fetchFilteredThumbnailsSucceeded = createAction(
  '[Images] Fetch filtered thumbnails succeeded',
  props<{ images: Image[]; filteredCount: number; totalCount: number }>(),
);
export const fetchFilteredThumbnailsFailed = createAction(
  '[Images] Fetch filtered thumbnails failed',
  props<{ error: LccError }>(),
);

export const fetchBatchThumbnailsRequested = createAction(
  '[Images] Fetch batch thumbnails requested',
  props<{
    imageIds: Id[];
    isAlbumCoverFetch?: boolean;
  }>(),
);
export const fetchBatchThumbnailsSucceeded = createAction(
  '[Images] Fetch batch thumbnails succeeded',
  props<{ images: Image[]; isAlbumCoverFetch?: boolean }>(),
);
export const fetchBatchThumbnailsFailed = createAction(
  '[Images] Fetch batch thumbnails failed',
  props<{ error: LccError }>(),
);

export const fetchOriginalRequested = createAction(
  '[Images] Fetch original requested',
  props<{ imageId: Id }>(),
);
export const fetchOriginalInBackgroundRequested = createAction(
  '[Images] Fetch original in background requested',
  props<{ imageId: Id }>(),
);
export const fetchOriginalSucceeded = createAction(
  '[Images] Fetch original succeeded',
  props<{ image: Image }>(),
);
export const fetchOriginalFailed = createAction(
  '[Images] Fetch original failed',
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

export const paginationOptionsChanged = createAction(
  '[Images] Pagination options changed',
  props<{ options: DataPaginationOptions<Image>; fetch: boolean }>(),
);

export const cancelSelected = createAction('[Images] Cancel selected');

export const formValueChanged = createAction(
  '[Images] Form value changed',
  props<{ values: (Partial<ImageFormData> & { id: Id })[] }>(),
);

export const imageFormDataReset = createAction(
  '[Images] Image form data reset',
  props<{ imageId: Id }>(),
);

export const albumFormDataReset = createAction(
  '[Images] Album form data reset',
  props<{ imageIds: Id[] }>(),
);

export const imageFileActionFailed = createAction(
  '[Images] Image file action failed',
  props<{ error: LccError }>(),
);

export const newImageRemoved = createAction(
  '[Images] New image removed',
  props<{ imageId: Id }>(),
);

export const allNewImagesRemoved = createAction('[Images] All new images removed');
