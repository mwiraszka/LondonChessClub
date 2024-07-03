import { Action, createReducer, on } from '@ngrx/store';

import { Photo } from '@app/types';

import * as PhotosActions from './photos.actions';
import { PhotosState, initialState } from './photos.state';

const photosReducer = createReducer(
  initialState,

  on(PhotosActions.imageOverlayOpened, (state, action) => ({
    ...state,
    overlayPhoto: action.photo,
  })),

  on(PhotosActions.imageOverlayClosed, () => initialState),

  on(PhotosActions.previousPhotoRequested, state => ({
    ...state,
    overlayPhoto: getPreviousPhoto(state.photos, state.overlayPhoto),
  })),

  on(PhotosActions.nextPhotoRequested, state => ({
    ...state,
    overlayPhoto: getNextPhoto(state.photos, state.overlayPhoto),
  })),
);

export function reducer(state: PhotosState, action: Action) {
  return photosReducer(state, action);
}

function getPreviousPhoto(photos: Photo[], currentPhoto: Photo | null): Photo | null {
  if (!currentPhoto || !photos.length) {
    return null;
  }

  const currentPhotoIndex = photos
    .map(photo => photo.filename)
    .indexOf(currentPhoto.filename);

  return currentPhotoIndex > 0
    ? photos[currentPhotoIndex - 1]
    : photos[photos.length - 1];
}

function getNextPhoto(photos: Photo[], currentPhoto: Photo | null): Photo | null {
  if (!currentPhoto || !photos.length) {
    return null;
  }

  const currentPhotoIndex = photos
    .map(photo => photo.filename)
    .indexOf(currentPhoto.filename);

  return currentPhotoIndex < photos.length - 1
    ? photos[currentPhotoIndex + 1]
    : photos[0];
}
