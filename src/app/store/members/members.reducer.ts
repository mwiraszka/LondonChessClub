import { Action, createReducer, on } from '@ngrx/store';

import { ControlModes, newMemberFormTemplate } from '@app/types';

import * as MembersActions from './members.actions';
import { MembersState, initialState } from './members.state';

const membersReducer = createReducer(
  initialState,

  on(MembersActions.setMember, (state, { member, controlMode }) => ({
    ...state,
    selectedMember: member,
    formMember: member,
    controlMode,
  })),

  on(
    MembersActions.cancelSelected,
    MembersActions.fetchMemberFailed,
    MembersActions.updateMemberSucceeded,
    MembersActions.deleteMemberFailed,
    MembersActions.deleteMemberCancelled,
    state => ({
      ...state,
      selectedMember: null,
      formMember: null,
      controlMode: 'view' as ControlModes,
    }),
  ),

  on(MembersActions.addMemberSucceeded, state => ({
    ...state,
    selectedMember: newMemberFormTemplate,
    formMember: newMemberFormTemplate,
  })),

  on(MembersActions.fetchMemberRequested, state => ({
    ...state,
    controlMode: 'edit' as ControlModes,
  })),

  on(MembersActions.fetchMembersSucceeded, (state, { members }) => ({
    ...state,
    members,
  })),

  on(MembersActions.fetchMemberSucceeded, (state, { member }) => ({
    ...state,
    members: [
      ...state.members.filter(storedMember => storedMember.id !== member.id),
      member,
    ],
  })),

  on(MembersActions.deleteMemberSelected, (state, { member }) => ({
    ...state,
    selectedMember: member,
  })),

  on(MembersActions.deleteMemberSucceeded, (state, { member }) => ({
    ...state,
    members: state.members.filter(memberInStore => memberInStore.id !== member.id),
    selectedMember: null,
  })),

  on(MembersActions.formDataChanged, (state, { member }) => ({
    ...state,
    formMember: member,
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
    sortedBy: header,
    isAscending: header === state.sortedBy ? !state.isAscending : false,
    pageNum: 1,
  })),

  on(MembersActions.inactiveMembersToggled, state => ({
    ...state,
    showActiveOnly: !state.showActiveOnly,
    pageNum: 1,
  })),
);

export function reducer(state: MembersState, action: Action): MembersState {
  return membersReducer(state, action);
}
