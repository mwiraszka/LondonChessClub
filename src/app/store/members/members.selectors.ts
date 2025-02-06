import { createFeatureSelector, createSelector } from '@ngrx/store';

import { newMemberFormTemplate } from '@app/components/member-form/new-member-form-template';
import type { Id } from '@app/models';
import { AuthSelectors } from '@app/store/auth';
import { areSame, customSort } from '@app/utils';

import { MembersState, membersAdapter } from './members.reducer';

const selectMembersState = createFeatureSelector<MembersState>('membersState');

const { selectAll: selectAllMembers } = membersAdapter.getSelectors(selectMembersState);

export const selectMemberById = (id: Id) =>
  createSelector(selectAllMembers, allMembers =>
    allMembers ? allMembers.find(member => member.id === id) : null,
  );

export const selectMemberId = createSelector(selectMembersState, state => state.memberId);

export const selectMember = createSelector(
  selectAllMembers,
  selectMemberId,
  (allMembers, memberId) =>
    memberId ? allMembers.find(member => member.id === memberId) : null,
);

export const selectMemberName = createSelector(selectMember, member =>
  member?.firstName && member?.lastName ? `${member.firstName} ${member.lastName}` : null,
);

export const selectMemberFormData = createSelector(
  selectMembersState,
  state => state.memberFormData,
);

export const selectMemberNameInForm = createSelector(selectMemberFormData, member =>
  member?.firstName && member?.lastName ? `${member.firstName} ${member.lastName}` : null,
);

export const selectControlMode = createSelector(
  selectMembersState,
  state => state.controlMode,
);

export const selectHasUnsavedChanges = createSelector(
  selectControlMode,
  selectMember,
  selectMemberFormData,
  (controlMode, member, memberFormData) => {
    if (!memberFormData) {
      return null;
    }

    if (controlMode === 'add') {
      return !areSame(memberFormData, newMemberFormTemplate);
    }

    if (!member) {
      return null;
    }

    const { id, modificationInfo, ...relevantPropertiesOfMember } = member;
    return !areSame(relevantPropertiesOfMember, memberFormData);
  },
);

export const selectSortedBy = createSelector(selectMembersState, state => state.sortedBy);

export const selectIsAscending = createSelector(
  selectMembersState,
  state => state.isAscending,
);

export const selectPageNum = createSelector(selectMembersState, state => state.pageNum);

export const selectPageSize = createSelector(selectMembersState, state => state.pageSize);

export const selectStartIndex = createSelector(
  selectPageSize,
  selectPageNum,
  (pageSize, pageNum) => pageSize * (pageNum - 1),
);

export const selectEndIndex = createSelector(
  selectPageSize,
  selectPageNum,
  (pageSize, pageNum) => pageSize * pageNum,
);

export const selectShowActiveOnly = createSelector(
  selectMembersState,
  state => state.showActiveOnly,
);

export const selectActiveMembers = createSelector(selectAllMembers, allMembers =>
  allMembers.filter(member => member.isActive),
);

export const selectSortedMembers = createSelector(
  selectAllMembers,
  selectSortedBy,
  selectIsAscending,
  (allMembers, sortedBy, isAscending) => {
    const sortKey =
      sortedBy === 'born'
        ? 'yearOfBirth'
        : sortedBy === 'lastUpdated'
          ? 'modificationInfo.dateLastEdited'
          : sortedBy;
    return [...allMembers].sort((a, b) =>
      customSort(a, b, sortKey, isAscending, 'lastName'),
    );
  },
);

export const selectFilteredMembers = createSelector(
  selectSortedMembers,
  selectShowActiveOnly,
  (sortedMembers, showActiveOnly) =>
    showActiveOnly ? sortedMembers.filter(member => member.isActive) : sortedMembers,
);

export const selectDisplayedMembers = createSelector(
  selectFilteredMembers,
  selectStartIndex,
  selectEndIndex,
  (filteredMembers, startIndex, endIndex) =>
    filteredMembers.slice(startIndex ?? 0, endIndex ?? undefined),
);

export const selectMembersTableMembersViewModel = createSelector({
  all: selectAllMembers,
  active: selectActiveMembers,
  displayed: selectDisplayedMembers,
  filtered: selectFilteredMembers,
});

export const selectMembersTableConfigViewModel = createSelector({
  pageNum: selectPageNum,
  pageSize: selectPageSize,
  isAscending: selectIsAscending,
  showActiveOnly: selectShowActiveOnly,
  sortedBy: selectSortedBy,
  startIndex: selectStartIndex,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectMemberFormViewModel = createSelector({
  member: selectMember,
  memberFormData: selectMemberFormData,
  memberName: selectMemberName,
  memberNameInForm: selectMemberNameInForm,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});

export const selectMemberEditorViewModel = createSelector({
  memberName: selectMemberName,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});
