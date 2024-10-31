import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { AuthState } from './auth.state';

export const authFeatureSelector = createFeatureSelector<AuthState>(StoreFeatures.AUTH);

export const isAdmin = createSelector(
  authFeatureSelector,
  state => state.user?.isVerified ?? false,
);

export const tempInitialPassword = createSelector(
  authFeatureSelector,
  state => state.tempInitialPassword,
);

export const user = createSelector(authFeatureSelector, state => state.user);

export const userHasCode = createSelector(authFeatureSelector, state => state.hasCode);
