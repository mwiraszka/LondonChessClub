import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { ImageOverlayState } from '../types/image-overlay.state';

export const imageOverlayFeatureSelector = createFeatureSelector<ImageOverlayState>(
  AppStoreFeatureTypes.IMAGE_OVERLAY
);

export const imageUrl = createSelector(
  imageOverlayFeatureSelector,
  (state) => state.imageUrl
);
export const isOpen = createSelector(
  imageOverlayFeatureSelector,
  (state) => !!state.imageUrl
);
