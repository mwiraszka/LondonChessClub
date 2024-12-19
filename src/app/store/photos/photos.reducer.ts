import { Action, createReducer, on } from '@ngrx/store';

import { Photo } from '@app/types';

import * as PhotosActions from './photos.actions';
import { PhotosState, initialState } from './photos.state';

const photosReducer = createReducer(
  initialState,

  on(
    PhotosActions.photoSelected,
    (state, { photo }): PhotosState => ({
      ...state,
      photo: photo,
    }),
  ),

  on(
    PhotosActions.previousPhotoRequested,
    (state): PhotosState => ({
      ...state,
      photo: getPreviousPhoto(state.photos, state.photo),
    }),
  ),

  on(
    PhotosActions.nextPhotoRequested,
    (state): PhotosState => ({
      ...state,
      photo: getNextPhoto(state.photos, state.photo),
    }),
  ),
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
