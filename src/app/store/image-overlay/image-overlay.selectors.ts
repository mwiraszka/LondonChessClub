import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';

import { ImageOverlayState } from './image-overlay.state';

export const imageOverlayFeatureSelector = createFeatureSelector<ImageOverlayState>(
  AppStoreFeatureTypes.IMAGE_OVERLAY,
);

export const photo = createSelector(imageOverlayFeatureSelector, state => state.photo);
export const isOpen = createSelector(imageOverlayFeatureSelector, state => !!state.photo);
