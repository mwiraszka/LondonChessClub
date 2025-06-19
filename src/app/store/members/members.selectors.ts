import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';

import type { Id } from '@app/models';
import { areSame, customSort } from '@app/utils';

import {
  INITIAL_MEMBER_FORM_DATA,
  MembersState,
  membersAdapter,
} from './members.reducer';

const selectMembersState = createFeatureSelector<MembersState>('membersState');

const { selectAll: selectAllMemberEntities } =
  membersAdapter.getSelectors(selectMembersState);

export const selectAllMembers = createSelector(
  selectAllMemberEntities,
  allMemberEntities => allMemberEntities.map(entity => entity?.member),
);

export const selectMemberById = (id: Id | null) =>
  createSelector(
    selectAllMembers,
    allMembers => allMembers.find(member => member.id === id) ?? null,
  );

export const selectMemberFormDataById = (id: Id | null) =>
  createSelector(
    selectMembersState,
    selectAllMemberEntities,
    (state, allMemberEntities) =>
      allMemberEntities.find(entity => entity.member.id === id)?.formData ??
      state.newMemberFormData,
  );

export const selectHasUnsavedChanges = (id: Id | null) =>
  createSelector(
    selectMemberById(id),
    selectMemberFormDataById(id),
    (member, memberFormData) => {
      const formPropertiesOfOriginalMember = pick(
        member ?? INITIAL_MEMBER_FORM_DATA,
        Object.getOwnPropertyNames(memberFormData),
      );

      // Only concerned with the day portion of these dates when checking for unsaved changes
      const { dateJoined: originalDateJoined, ...originalRemainder } =
        formPropertiesOfOriginalMember;
      const { dateJoined: formDataDateJoined, ...formDataRemainder } = memberFormData;

      return (
        originalDateJoined?.slice(0, 10) !== formDataDateJoined?.slice(0, 10) ||
        !areSame(formDataRemainder, originalRemainder)
      );
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
    let primarySortKey: string;

    switch (sortedBy) {
      case 'born':
        primarySortKey = 'yearOfBirth';
        break;
      case 'name':
        primarySortKey = 'lastName';
        break;
      case 'lastUpdated':
        primarySortKey = 'modificationInfo.dateLastEdited';
        break;
      default:
        primarySortKey = sortedBy;
    }

    const secondarySortKey = primarySortKey === 'lastName' ? 'firstName' : 'lastName';

    return [...allMembers].sort((a, b) =>
      customSort(a, b, primarySortKey, !isAscending, secondarySortKey),
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
