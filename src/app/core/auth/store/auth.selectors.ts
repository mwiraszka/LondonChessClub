import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types/app-store-features.model';

import { AuthState } from './auth.state';
import { UserRoleTypes } from '@app/shared/types';

export const authFeatureSelector = createFeatureSelector<AuthState>(
  AppStoreFeatureTypes.AUTH
);

export const isAdmin = createSelector(
  authFeatureSelector,
  (state) => state.user?.role === UserRoleTypes.ADMIN ?? false
);

export const user = createSelector(authFeatureSelector, (state) => state.user);

export const isUserVerified = createSelector(
  authFeatureSelector,
  (state) => state.user?.isVerified
);
