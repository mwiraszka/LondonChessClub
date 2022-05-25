import { createReducer, on, Action } from '@ngrx/store';

import * as MemberListActions from './member-list.actions';
import { MemberListState } from './member-list.state';

const initialState: MemberListState = {
  members: [],
  selectedMember: null,
  isLoading: false,
};

const memberListReducer = createReducer(
  initialState,
  on(MemberListActions.loadMembersStarted, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(MemberListActions.loadMembersSucceeded, (state, action) => ({
    ...state,
    members: action.allMembers,
    isLoading: false,
  })),
  on(MemberListActions.loadMembersFailed, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(MemberListActions.createMemberSelected, (state) => ({
    ...state,
    selectedMember: null,
  })),
  on(MemberListActions.editMemberSelected, (state, action) => ({
    ...state,
    selectedMember: action.memberToEdit,
  })),
  on(MemberListActions.deleteMemberSelected, (state, action) => ({
    ...state,
    selectedMember: action.memberToDelete,
  })),
  on(MemberListActions.deleteMemberSucceeded, (state, action) => ({
    ...state,
    members: state.members.filter((x) => x.id != action.deletedMember.id),
    selectedMember: null,
  })),
  on(MemberListActions.deleteMemberFailed, (state) => ({
    ...state,
    selectedMember: null,
  })),
  on(MemberListActions.deleteMemberCancelled, (state) => ({
    ...state,
    selectedMember: null,
  }))
);

export function reducer(state: MemberListState, action: Action) {
  return memberListReducer(state, action);
}
