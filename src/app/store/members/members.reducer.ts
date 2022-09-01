import { createReducer, on, Action } from '@ngrx/store';

import * as MembersActions from './members.actions';
import { initialState, MembersState } from './members.state';

const membersReducer = createReducer(
  initialState,
  on(MembersActions.loadMembersStarted, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(MembersActions.loadMembersSucceeded, (state, action) => ({
    ...state,
    members: action.allMembers,
    isLoading: false,
  })),
  on(MembersActions.loadMembersFailed, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(MembersActions.membersSorted, (state, action) => ({
    ...state,
    members: action.sortedMembers,
    isDescending: action.isDescending,
    sortedBy: action.sortedBy,
  })),
  on(MembersActions.createMemberSelected, (state) => ({
    ...state,
    selectedMember: null,
    isEditMode: false,
  })),
  on(MembersActions.editMemberSelected, (state, action) => ({
    ...state,
    selectedMember: action.memberToEdit,
    memberBeforeEdit: action.memberToEdit,
    memberCurrently: action.memberToEdit,
    isEditMode: true,
  })),
  on(MembersActions.deleteMemberSelected, (state, action) => ({
    ...state,
    selectedMember: action.memberToDelete,
  })),
  on(MembersActions.deleteMemberSucceeded, (state, action) => ({
    ...state,
    members: state.members.filter((x) => x.id != action.deletedMember.id),
    selectedMember: null,
  })),
  on(MembersActions.deleteMemberFailed, (state) => ({
    ...state,
    selectedMember: null,
  })),
  on(MembersActions.deleteMemberCancelled, (state) => ({
    ...state,
    selectedMember: null,
  })),
  on(
    MembersActions.resetMemberForm,
    MembersActions.addMemberSucceeded,
    MembersActions.addMemberFailed,
    MembersActions.updateMemberSucceeded,
    MembersActions.updateMemberFailed,
    MembersActions.cancelConfirmed,
    (state) => ({
      ...state,
      memberBeforeEdit: initialState.memberBeforeEdit,
      memberCurrently: initialState.memberCurrently,
    })
  ),
  on(MembersActions.formDataChanged, (state, action) => ({
    ...state,
    memberCurrently: action.member,
  }))
);

export function reducer(state: MembersState, action: Action) {
  return membersReducer(state, action);
}
