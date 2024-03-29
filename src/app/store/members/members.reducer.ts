import { Action, createReducer, on } from '@ngrx/store';

import { customSort } from '@app/utils';

import * as MembersActions from './members.actions';
import { MembersState, initialState } from './members.state';

const membersReducer = createReducer(
  initialState,

  on(MembersActions.fetchMembersSucceeded, (state, action) => ({
    ...state,
    members: [...action.allMembers].sort(customSort(state.sortedBy, state.isAscending)),
  })),

  on(MembersActions.pageChanged, (state, action) => ({
    ...state,
    pageNum: action.pageNum,
  })),

  on(MembersActions.pageSizeChanged, (state, action) => ({
    ...state,
    pageSize: action.pageSize,
    pageNum: 1,
  })),

  on(MembersActions.tableHeaderSelected, (state, action) => ({
    ...state,
    members: [...state.members].sort(
      customSort(
        action.header === 'born'
          ? 'yearOfBirth'
          : action.header === 'lastUpdated'
          ? 'modificationInfo.dateLastEdited'
          : action.header,
        action.header === state.sortedBy ? !state.isAscending : false,
      ),
    ),
    sortedBy: action.header,
    isAscending: action.header === state.sortedBy ? !state.isAscending : false,
  })),

  on(MembersActions.inactiveMembersToggled, state => ({
    ...state,
    showActiveOnly: !state.showActiveOnly,
    pageNum: 1,
  })),

  on(MembersActions.addMemberSelected, (state, action) => ({
    ...state,
    memberCurrently: action.memberToAdd,
  })),

  on(MembersActions.editMemberRouteEntered, (state, action) => ({
    ...state,
    selectedMember: action.member,
    memberCurrently: action.member,
    memberBeforeEdit: action.member,
    isEditMode: true,
  })),

  on(MembersActions.updateMemberSelected, (state, action) => ({
    ...state,
    memberCurrently: action.memberToUpdate,
  })),

  on(MembersActions.deleteMemberSelected, (state, action) => ({
    ...state,
    selectedMember: action.memberToDelete,
  })),

  on(MembersActions.deleteMemberSucceeded, (state, action) => ({
    ...state,
    members: state.members.filter(member => member.id !== action.deletedMember.id),
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

  on(MembersActions.formDataChanged, (state, action) => ({
    ...state,
    memberCurrently: action.member,
  })),
);

export function reducer(state: MembersState, action: Action): MembersState {
  return membersReducer(state, action);
}
