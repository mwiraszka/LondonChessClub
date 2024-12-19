import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { PhotosState } from './photos.state';

export const photosFeatureSelector = createFeatureSelector<PhotosState>(
  StoreFeatures.PHOTOS,
);

export const photos = createSelector(photosFeatureSelector, state => state.photos);

export const photo = createSelector(photosFeatureSelector, state => state.photo);

export const isOpen = createSelector(photosFeatureSelector, state => !!state.photo);
