import { Action, createReducer, on } from '@ngrx/store';

import { ControlModes, newMemberFormTemplate } from '@app/types';

import * as MembersActions from './members.actions';
import { MembersState, initialState } from './members.state';

const membersReducer = createReducer(
  initialState,

  on(MembersActions.fetchMembersSucceeded, (state, { members }) => ({
    ...state,
    members,
  })),

  on(MembersActions.memberAddRequested, state => ({
    ...state,
    setMember: newMemberFormTemplate,
    formMember: newMemberFormTemplate,
    controlMode: 'add' as ControlModes,
  })),

  on(MembersActions.memberEditRequested, state => ({
    ...state,
    controlMode: 'edit' as ControlModes,
  })),

  on(MembersActions.memberSet, (state, { member }) => ({
    ...state,
    setMember: member,
  })),

  on(MembersActions.memberUnset, state => ({
    ...state,
    setMember: null,
    formMember: null,
    controlMode: null,
  })),

  on(
    MembersActions.addMemberSucceeded,
    MembersActions.updateMemberSucceeded,
    (state, { member }) => ({
      ...state,
      events: [
        ...state.members.map(storedMember =>
          storedMember.id === member.id ? member : storedMember,
        ),
      ],
      setMember: null,
      formMember: null,
    }),
  ),

  on(MembersActions.fetchMemberSucceeded, (state, { member }) => ({
    ...state,
    members: [
      ...state.members.filter(storedMember => storedMember.id !== member.id),
      member,
    ],
    setMember: member,
    formMember: state.controlMode === 'edit' ? member : null,
  })),

  on(MembersActions.deleteMemberSelected, (state, { member }) => ({
    ...state,
    setMember: member,
  })),

  on(MembersActions.deleteMemberSucceeded, (state, { member }) => ({
    ...state,
    members: state.members.filter(memberInStore => memberInStore.id !== member.id),
    setMember: null,
    formMember: null,
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
