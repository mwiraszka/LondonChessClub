import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { ToasterState } from './toaster.state';

export const selectToasterState = createFeatureSelector<ToasterState>(
  StoreFeatures.TOASTER,
);

export const selectToasts = createSelector(selectToasterState, state => state.toasts);
export const selectIsDisplayingToasts = createSelector(selectToasts, toasts => !!toasts);
