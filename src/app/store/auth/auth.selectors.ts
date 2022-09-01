import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes, UserRoleTypes } from '@app/types';

import { AuthState } from './auth.state';

export const authFeatureSelector = createFeatureSelector<AuthState>(
  AppStoreFeatureTypes.AUTH
);

export const isAdmin = createSelector(
  authFeatureSelector,
  // (state) => state.user?.role === UserRoleTypes.ADMIN ?? false
  (state) => true // temp
);

export const user = createSelector(authFeatureSelector, (state) => state.user);

export const isUserVerified = createSelector(
  authFeatureSelector,
  (state) => state.user?.isVerified
);
