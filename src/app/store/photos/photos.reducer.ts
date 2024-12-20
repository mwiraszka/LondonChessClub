import { Action, createReducer, on } from '@ngrx/store';

import { Photo } from '@app/types';

import * as PhotosActions from './photos.actions';
import { PhotosState, initialState } from './photos.state';

const photosReducer = createReducer(
  initialState,

  on(
    PhotosActions.photoSelected,
    ({ photos }, { photo }): PhotosState => ({
      photos,
      photo,
    }),
  ),

  on(
    PhotosActions.previousPhotoRequested,
    ({ photos, photo }): PhotosState => ({
      photos,
      photo: getPreviousPhoto(photos, photo),
    }),
  ),

  on(
    PhotosActions.nextPhotoRequested,
    ({ photos, photo }): PhotosState => ({
      photos,
      photo: getNextPhoto(photos, photo),
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
  const currentIndex = photos.map(photo => photo.filename).indexOf(currentPhoto.filename);
  return currentIndex > 0 ? photos[currentIndex - 1] : photos[photos.length - 1];
}

function getNextPhoto(photos: Photo[], currentPhoto: Photo | null): Photo | null {
  if (!currentPhoto || !photos.length) {
    return null;
  }
  const currentIndex = photos.map(photo => photo.filename).indexOf(currentPhoto.filename);
  return currentIndex < photos.length - 1 ? photos[currentIndex + 1] : photos[0];
}
