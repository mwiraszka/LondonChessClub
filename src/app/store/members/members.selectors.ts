import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';
import { areSame } from '@app/utils';

import { MembersState } from './members.state';

export const membersFeatureSelector = createFeatureSelector<MembersState>(
  AppStoreFeatureTypes.MEMBERS
);

export const members = createSelector(membersFeatureSelector, (state) => state.members);

export const selectedMember = createSelector(
  membersFeatureSelector,
  (state) => state.selectedMember
);

export const isLoading = createSelector(
  membersFeatureSelector,
  (state) => state.isLoading
);

export const sortedBy = createSelector(membersFeatureSelector, (state) => state.sortedBy);

export const isDescending = createSelector(
  membersFeatureSelector,
  (state) => state.isDescending
);

export const memberBeforeEdit = createSelector(
  membersFeatureSelector,
  (state) => state.memberBeforeEdit
);

export const memberCurrently = createSelector(
  membersFeatureSelector,
  (state) => state.memberCurrently
);

export const isEditMode = createSelector(
  membersFeatureSelector,
  (state) => state.isEditMode
);

export const hasUnsavedChanges = createSelector(
  membersFeatureSelector,
  (state) => !areSame(state.memberCurrently, state.memberBeforeEdit)
);
