import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>(StoreFeatures.AUTH);

export const selectIsAdmin = createSelector(
  selectAuthState,
  state => state.user?.isVerified ?? false,
);

export const selectTemporaryPassword = createSelector(
  selectAuthState,
  state => state.temporaryPassword,
);

export const selectUser = createSelector(selectAuthState, state => state.user);

export const selectUserHasCode = createSelector(selectAuthState, state => state.hasCode);

export const selectChangePasswordFormViewModel = createSelector({
  user: selectUser,
  userHasCode: selectUserHasCode,
  temporaryPassword: selectTemporaryPassword,
});
