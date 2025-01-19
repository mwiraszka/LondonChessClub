import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('authState');

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
