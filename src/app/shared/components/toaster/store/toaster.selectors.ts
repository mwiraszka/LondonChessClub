import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { ToasterState } from '../types/toaster.state';

export const toasterFeatureSelector = createFeatureSelector<ToasterState>(
  AppStoreFeatures.TOASTER
);

export const toasts = createSelector(toasterFeatureSelector, (state) => state.toasts);

export const isDisplayingToasts = createSelector(
  toasterFeatureSelector,
  (state) => !!state.toasts
);
