import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { AlertState } from '../types/alert.state';

export const alertFeatureSelector = createFeatureSelector<AlertState>(
  AppStoreFeatureTypes.ALERT
);

export const alert = createSelector(alertFeatureSelector, (state) => state.alert);
export const isActive = createSelector(alertFeatureSelector, (state) => !!state.alert);
