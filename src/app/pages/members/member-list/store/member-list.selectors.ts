import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { MemberListState } from './member-list.state';

export const memberListFeatureSelector = createFeatureSelector<MemberListState>(
  AppStoreFeatureTypes.MEMBER_LIST
);

export const members = createSelector(
  memberListFeatureSelector,
  (state) => state.members
);

export const selectedMember = createSelector(
  memberListFeatureSelector,
  (state) => state.selectedMember
);

export const isLoading = createSelector(
  memberListFeatureSelector,
  (state) => state.isLoading
);

export const sortedBy = createSelector(
  memberListFeatureSelector,
  (state) => state.sortedBy
);

export const isAscending = createSelector(
  memberListFeatureSelector,
  (state) => state.isAscending
);
