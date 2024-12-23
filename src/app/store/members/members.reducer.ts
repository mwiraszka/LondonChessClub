import { Action, createReducer, on } from '@ngrx/store';

import { MemberFormData, newMemberFormTemplate } from '@app/types';

import * as MembersActions from './members.actions';
import { MembersState, initialState } from './members.state';

const membersReducer = createReducer(
  initialState,

  on(
    MembersActions.fetchMembersSucceeded,
    (state, { members }): MembersState => ({
      ...state,
      members,
    }),
  ),

  on(
    MembersActions.fetchMemberRequested,
    (state, { controlMode }): MembersState => ({
      ...state,
      controlMode,
    }),
  ),

  on(
    MembersActions.newMemberFormTemplateLoaded,
    (state): MembersState => ({
      ...state,
      memberFormData: newMemberFormTemplate,
    }),
  ),

  on(MembersActions.fetchMemberSucceeded, (state, { member }): MembersState => {
    const { id, modificationInfo, ...memberFormData } = member;
    return {
      ...state,
      members: [
        ...state.members.map(storedMember =>
          storedMember.id === member.id ? member : storedMember,
        ),
      ],
      member,
      memberFormData,
    };
  }),

  on(
    MembersActions.addMemberSucceeded,
    MembersActions.updateMemberSucceeded,
    (state, { member }): MembersState => ({
      ...state,
      members: [
        ...state.members.map(storedMember =>
          storedMember.id === member.id ? member : storedMember,
        ),
      ],
      member: null,
      memberFormData: null,
    }),
  ),

  on(
    MembersActions.deleteMemberSelected,
    (state, { member }): MembersState => ({
      ...state,
      member,
    }),
  ),

  on(
    MembersActions.deleteMemberSucceeded,
    (state, { member }): MembersState => ({
      ...state,
      members: state.members.filter(storedMember => storedMember.id !== member.id),
      member: null,
      memberFormData: null,
    }),
  ),

  on(MembersActions.formValueChanged, (state, { value }): MembersState => {
    console.log(':: value', value);
    return {
      ...state,
      memberFormData: value as Required<MemberFormData>,
    };
  }),

  on(
    MembersActions.pageChanged,
    (state, { pageNum }): MembersState => ({
      ...state,
      pageNum,
    }),
  ),

  on(
    MembersActions.pageSizeChanged,
    (state, { pageSize }): MembersState => ({
      ...state,
      pageSize,
      pageNum: 1,
    }),
  ),

  on(
    MembersActions.tableHeaderSelected,
    (state, { header }): MembersState => ({
      ...state,
      sortedBy: header,
      isAscending: header === state.sortedBy ? !state.isAscending : false,
      pageNum: 1,
    }),
  ),

  on(
    MembersActions.inactiveMembersToggled,
    (state): MembersState => ({
      ...state,
      showActiveOnly: !state.showActiveOnly,
      pageNum: 1,
    }),
  ),

  on(
    MembersActions.memberUnset,
    (state): MembersState => ({
      ...state,
      member: null,
      memberFormData: null,
      controlMode: null,
    }),
  ),
);

export function reducer(state: MembersState, action: Action): MembersState {
  return membersReducer(state, action);
}
