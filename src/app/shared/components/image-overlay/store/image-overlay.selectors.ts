import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { ImageOverlayState } from '../types/image-overlay.state';

export const imageOverlayFeatureSelector = createFeatureSelector<ImageOverlayState>(
  AppStoreFeatureTypes.IMAGE_OVERLAY
);

export const imagePath = createSelector(
  imageOverlayFeatureSelector,
  (state) => state.imagePath
);
export const isOpen = createSelector(
  imageOverlayFeatureSelector,
  (state) => !!state.imagePath
);
