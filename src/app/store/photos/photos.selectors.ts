import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';

import { PhotosState } from './photos.state';

export const photosFeatureSelector = createFeatureSelector<PhotosState>(
  AppStoreFeatureTypes.PHOTOS
);

export const photos = createSelector(photosFeatureSelector, (state) => state.photos);

export const overlayPhoto = createSelector(
  photosFeatureSelector,
  (state) => state.overlayPhoto
);

export const isOpen = createSelector(
  photosFeatureSelector,
  (state) => !!state.overlayPhoto
);
