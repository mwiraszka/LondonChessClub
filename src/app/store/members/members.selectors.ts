import { createFeatureSelector, createSelector } from '@ngrx/store';

import { newMemberFormTemplate } from '@app/components/member-form/new-member-form-template';
import type { Id } from '@app/models';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { areSame, customSort } from '@app/utils';

import { MembersState } from './members.state';

export const selectMembersState = createFeatureSelector<MembersState>('members');

export const selectMembers = createSelector(selectMembersState, state => state.members);

export const selectMemberById = (id: Id) =>
  createSelector(selectMembers, members => {
    return members ? members.find(member => member.id === id) : null;
  });

export const selectActiveMembers = createSelector(selectMembersState, state =>
  state.members.filter(member => member.isActive),
);

export const selectMember = createSelector(selectMembersState, state => state.member);

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

export const selectSortedMembers = createSelector(
  selectMembers,
  selectSortedBy,
  selectIsAscending,
  (members, sortedBy, isAscending) => {
    const sortKey =
      sortedBy === 'born'
        ? 'yearOfBirth'
        : sortedBy === 'lastUpdated'
          ? 'modificationInfo.dateLastEdited'
          : sortedBy;
    const sortedMembers = [...members].sort(customSort(sortKey));
    return isAscending ? sortedMembers : sortedMembers.reverse();
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

const _selectMembersTableViewModelMembers = createSelector({
  all: selectMembers,
  active: selectActiveMembers,
  displayed: selectDisplayedMembers,
  filtered: selectFilteredMembers,
});

const _selectMembersTableViewModelPagination = createSelector({
  pageNum: selectPageNum,
  pageSize: selectPageSize,
});

export const selectMembersTableViewModel = createSelector({
  members: _selectMembersTableViewModelMembers,
  pagination: _selectMembersTableViewModelPagination,
  isAdmin: AuthSelectors.selectIsAdmin,
  isAscending: selectIsAscending,
  isSafeMode: AppSelectors.selectIsSafeMode,
  showActiveOnly: selectShowActiveOnly,
  sortedBy: selectSortedBy,
  startIndex: selectStartIndex,
});

export const selectMemberFormViewModel = createSelector({
  member: selectMember,
  memberFormData: selectMemberFormData,
  memberName: selectMemberName,
  memberNameInForm: selectMemberNameInForm,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
  isSafeMode: AppSelectors.selectIsSafeMode,
});

export const selectMemberEditorViewModel = createSelector({
  memberName: selectMemberName,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});
