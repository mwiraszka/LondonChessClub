import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types/app-store-features.model';

import { AuthState } from '../types/auth.state';

export const authFeatureSelector = createFeatureSelector<AuthState>(
  AppStoreFeatures.AUTH
);

export const user = createSelector(authFeatureSelector, (state) => state.user);
