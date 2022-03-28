import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { ToasterState } from '../types/toaster.state';

export const toasterFeatureSelector = createFeatureSelector<ToasterState>(
  AppStoreFeatures.TOASTER
);

export const selectToasts = createSelector(
  toasterFeatureSelector,
  (state) => state.toasts
);
