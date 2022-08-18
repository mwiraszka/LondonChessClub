import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberListScreenState } from './member-list-screen.state';

export const memberListScreenFeatureSelector =
  createFeatureSelector<MemberListScreenState>(AppStoreFeatureTypes.MEMBER_LIST_SCREEN);

export const members = createSelector(
  memberListScreenFeatureSelector,
  (state) => state.members
);

export const selectedMember = createSelector(
  memberListScreenFeatureSelector,
  (state) => state.selectedMember
);

export const isLoading = createSelector(
  memberListScreenFeatureSelector,
  (state) => state.isLoading
);

export const sortedBy = createSelector(
  memberListScreenFeatureSelector,
  (state) => state.sortedBy
);

export const isDescending = createSelector(
  memberListScreenFeatureSelector,
  (state) => state.isDescending
);
