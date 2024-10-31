import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { ToasterState } from './toaster.state';

export const toasterFeatureSelector = createFeatureSelector<ToasterState>(
  StoreFeatures.TOASTER,
);

export const toasts = createSelector(toasterFeatureSelector, state => state.toasts);

export const isDisplayingToasts = createSelector(
  toasterFeatureSelector,
  state => !!state.toasts,
);
