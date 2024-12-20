import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { PhotosState } from './photos.state';

export const selectPhotosState = createFeatureSelector<PhotosState>(StoreFeatures.PHOTOS);

export const selectPhotos = createSelector(selectPhotosState, state => state.photos);
export const selectPhoto = createSelector(selectPhotosState, state => state.photo);
