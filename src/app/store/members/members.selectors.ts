import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';
import { areSame } from '@app/utils';

import { MembersState } from './members.state';

export const membersFeatureSelector = createFeatureSelector<MembersState>(
  AppStoreFeatureTypes.MEMBERS,
);

export const members = createSelector(membersFeatureSelector, state => state.members);

export const memberById = (id: string) =>
  createSelector(members, allMembers => {
    return allMembers ? allMembers.find(member => member.id === id) : null;
  });

export const activeMembers = createSelector(membersFeatureSelector, state =>
  state.members.filter(member => member.isActive),
);

export const selectedMember = createSelector(
  membersFeatureSelector,
  state => state.selectedMember,
);

export const selectedMemberName = createSelector(
  selectedMember,
  member => `${member?.firstName} ${member?.lastName}`,
);

export const memberCurrently = createSelector(
  membersFeatureSelector,
  state => state.memberCurrently,
);

export const isEditMode = createSelector(
  membersFeatureSelector,
  state => state.isEditMode,
);

export const hasUnsavedChanges = createSelector(
  membersFeatureSelector,
  state => !areSame(state.memberCurrently, state.selectedMember),
);

export const sortedBy = createSelector(membersFeatureSelector, state => state.sortedBy);

export const isAscending = createSelector(
  membersFeatureSelector,
  state => state.isAscending,
);

export const pageNum = createSelector(membersFeatureSelector, state => state.pageNum);

export const pageSize = createSelector(membersFeatureSelector, state => state.pageSize);

export const startIndex = createSelector(
  membersFeatureSelector,
  state => state.pageSize * (state.pageNum - 1),
);

export const endIndex = createSelector(
  membersFeatureSelector,
  state => state.pageSize * state.pageNum,
);

export const showActiveOnly = createSelector(
  membersFeatureSelector,
  state => state.showActiveOnly,
);

export const filteredMembers = createSelector(membersFeatureSelector, state =>
  state.showActiveOnly ? state.members.filter(member => member.isActive) : state.members,
);

export const displayedMembers = createSelector(
  filteredMembers,
  startIndex,
  endIndex,
  (filteredMembers, startIndex, endIndex) =>
    filteredMembers.slice(startIndex ?? 0, endIndex ?? 0),
);
