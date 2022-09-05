import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';

import { AuthState } from './auth.state';

export const authFeatureSelector = createFeatureSelector<AuthState>(
  AppStoreFeatureTypes.AUTH
);

export const user = createSelector(authFeatureSelector, (state) => state.user);

export const isAdmin = createSelector(
  authFeatureSelector,
  (state) => state.user?.role === 'admin' && state.user?.isVerified
);

export const isUserVerified = createSelector(
  authFeatureSelector,
  (state) => state.user?.isVerified
);

export const userHasCode = createSelector(
  authFeatureSelector,
  (state) => state.user?.hasCode
);
