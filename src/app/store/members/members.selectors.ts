import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';

import { INITIAL_MEMBER_FORM_DATA } from '@app/constants';
import type { Id } from '@app/models';
import { areSame } from '@app/utils';

import { MembersState, membersAdapter } from './members.reducer';

const selectMembersState = createFeatureSelector<MembersState>('membersState');

export const selectLastFetch = createSelector(
  selectMembersState,
  state => state.lastFetch,
);

export const selectOptions = createSelector(selectMembersState, state => state.options);

export const selectFilteredCount = createSelector(
  selectMembersState,
  state => state.filteredCount,
);

export const selectTotalCount = createSelector(
  selectMembersState,
  state => state.totalCount,
);

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
