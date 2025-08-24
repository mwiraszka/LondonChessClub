import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('authState');

export const selectCallState = createSelector(selectAuthState, state => state.callState);

export const selectIsAdmin = createSelector(
  selectAuthState,
  state => !!state.user?.isAdmin,
);

export const selectUser = createSelector(selectAuthState, state => state.user);

export const selectUserId = createSelector(selectUser, user => user?.id);

export const selectHasCode = createSelector(selectAuthState, state => state.hasCode);
