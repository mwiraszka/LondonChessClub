import { createAction, props } from '@ngrx/store';

import { Photo } from '@app/types';

enum PhotosActionTypes {
  IMAGE_OVERLAY_OPENED = '[Photos] Image overlay opened',
  IMAGE_OVERLAY_CLOSED = '[Photos] Image overlay closed',
  PREVIOUS_PHOTO_REQUESTED = '[Photos] Previous photo requested',
  NEXT_PHOTO_REQUESTED = '[Photos] Next photo requested',
}

export const previousPhotoRequested = createAction(
  PhotosActionTypes.PREVIOUS_PHOTO_REQUESTED,
);

export const nextPhotoRequested = createAction(PhotosActionTypes.NEXT_PHOTO_REQUESTED);

export const imageOverlayOpened = createAction(
  PhotosActionTypes.IMAGE_OVERLAY_OPENED,
  props<{ photo: Photo }>(),
);

export const imageOverlayClosed = createAction(PhotosActionTypes.IMAGE_OVERLAY_CLOSED);
