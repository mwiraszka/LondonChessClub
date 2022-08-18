import { createReducer, on, Action } from '@ngrx/store';

import * as MemberListScreenActions from './member-list-screen.actions';
import { MemberListScreenState } from './member-list-screen.state';

const initialState: MemberListScreenState = {
  members: [],
  selectedMember: null,
  isLoading: false,
  sortedBy: 'rating',
  isDescending: true,
};

const memberListScreenReducer = createReducer(
  initialState,
  on(MemberListScreenActions.loadMembersStarted, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(MemberListScreenActions.loadMembersSucceeded, (state, action) => ({
    ...state,
    members: action.allMembers,
    isLoading: false,
  })),
  on(MemberListScreenActions.loadMembersFailed, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(MemberListScreenActions.membersSorted, (state, action) => ({
    ...state,
    members: action.sortedMembers,
    isDescending: action.isDescending,
    sortedBy: action.sortedBy,
  })),
  on(MemberListScreenActions.createMemberSelected, (state) => ({
    ...state,
    selectedMember: null,
  })),
  on(MemberListScreenActions.editMemberSelected, (state, action) => ({
    ...state,
    selectedMember: action.memberToEdit,
  })),
  on(MemberListScreenActions.deleteMemberSelected, (state, action) => ({
    ...state,
    selectedMember: action.memberToDelete,
  })),
  on(MemberListScreenActions.deleteMemberSucceeded, (state, action) => ({
    ...state,
    members: state.members.filter((x) => x.id != action.deletedMember.id),
    selectedMember: null,
  })),
  on(MemberListScreenActions.deleteMemberFailed, (state) => ({
    ...state,
    selectedMember: null,
  })),
  on(MemberListScreenActions.deleteMemberCancelled, (state) => ({
    ...state,
    selectedMember: null,
  }))
);

export function reducer(state: MemberListScreenState, action: Action) {
  return memberListScreenReducer(state, action);
}
