import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Id } from '@app/models';

import { ImagesState } from './images.reducer';

export const selectImagesState = createFeatureSelector<ImagesState>('imagesState');

export const selectImages = createSelector(selectImagesState, state => state.images);

export const selectThumbnailImages = createSelector(selectImages, images =>
  images.filter(image => image.id.endsWith('-600x400')),
);

export const selectImageById = (id: Id) =>
  createSelector(selectImages, images =>
    images ? images.find(image => image.id === id) : null,
  );

export const selectIsNewImageStored = createSelector(
  selectImagesState,
  state => state.isNewImageStored,
);
