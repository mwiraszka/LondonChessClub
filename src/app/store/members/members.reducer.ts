import { Action, createReducer, on } from '@ngrx/store';

import { customSort } from '@app/utils';

import * as MembersActions from './members.actions';
import { MembersState, initialState } from './members.state';

const membersReducer = createReducer(
  initialState,

  on(MembersActions.fetchMembersSucceeded, (state, { allMembers }) => ({
    ...state,
    members: [...allMembers].sort(customSort(state.sortedBy, state.isAscending)),
  })),

  on(MembersActions.fetchMemberForEditScreenSucceeded, (state, { member }) => ({
    ...state,
    members: [
      ...state.members.filter(storedMember => storedMember.id !== member.id),
      member,
    ],
  })),

  on(MembersActions.memberSetForEditing, (state, { member }) => ({
    ...state,
    selectedMember: member,
    memberBeforeEdit: member,
    memberCurrently: member,
    isEditMode: true,
  })),

  on(MembersActions.pageChanged, (state, { pageNum }) => ({
    ...state,
    pageNum,
  })),

  on(MembersActions.pageSizeChanged, (state, { pageSize }) => ({
    ...state,
    pageSize,
    pageNum: 1,
  })),

  on(MembersActions.tableHeaderSelected, (state, { header }) => ({
    ...state,
    members: [...state.members].sort(
      customSort(
        header === 'born'
          ? 'yearOfBirth'
          : header === 'lastUpdated'
          ? 'modificationInfo.dateLastEdited'
          : header,
        header === state.sortedBy ? !state.isAscending : false,
      ),
    ),
    sortedBy: header,
    isAscending: header === state.sortedBy ? !state.isAscending : false,
  })),

  on(MembersActions.inactiveMembersToggled, state => ({
    ...state,
    showActiveOnly: !state.showActiveOnly,
    pageNum: 1,
  })),

  on(MembersActions.addMemberSelected, (state, { memberToAdd }) => ({
    ...state,
    memberCurrently: memberToAdd,
  })),

  on(MembersActions.updateMemberSelected, (state, { memberToUpdate }) => ({
    ...state,
    memberCurrently: memberToUpdate,
  })),

  on(MembersActions.deleteMemberSelected, (state, { memberToDelete }) => ({
    ...state,
    selectedMember: memberToDelete,
  })),

  on(MembersActions.deleteMemberSucceeded, (state, { deletedMember }) => ({
    ...state,
    members: state.members.filter(member => member.id !== deletedMember.id),
    selectedMember: null,
  })),

  on(MembersActions.deleteMemberFailed, MembersActions.deleteMemberCancelled, state => ({
    ...state,
    selectedMember: null,
  })),

  on(
    MembersActions.addMemberSucceeded,
    MembersActions.addMemberFailed,
    MembersActions.updateMemberSucceeded,
    MembersActions.updateMemberFailed,
    MembersActions.cancelConfirmed,
    MembersActions.resetMemberForm,
    state => ({
      ...state,
      memberCurrently: initialState.memberCurrently,
      memberBeforeEdit: initialState.memberBeforeEdit,
      isEditMode: false,
    }),
  ),

  on(MembersActions.formDataChanged, (state, { member }) => ({
    ...state,
    memberCurrently: member,
  })),
);

export function reducer(state: MembersState, action: Action): MembersState {
  return membersReducer(state, action);
}
