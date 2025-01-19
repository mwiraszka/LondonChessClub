import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ControlMode, Id, Member, MemberFormData } from '@app/models';

import * as MembersActions from './members.actions';

export interface MembersState extends EntityState<Member> {
  memberId: Id | null;
  memberFormData: MemberFormData | null;
  controlMode: ControlMode | null;
  sortedBy: string;
  isAscending: boolean;
  pageNum: number;
  pageSize: number;
  showActiveOnly: boolean;
}

export const membersAdapter = createEntityAdapter<Member>();

export const membersInitialState: MembersState = membersAdapter.getInitialState({
  memberId: null,
  memberFormData: null,
  controlMode: null,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
});

export const membersReducer = createReducer(
  membersInitialState,

  on(
    MembersActions.fetchMembersSucceeded,
    (state, { members }): MembersState => membersAdapter.addMany(members, state),
  ),

  on(
    MembersActions.newMemberRequested,
    (state): MembersState => ({
      ...state,
      controlMode: 'add',
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
    MembersActions.fetchMemberSucceeded,
    (state, { member }): MembersState =>
      membersAdapter.upsertOne(member, { ...state, memberId: member.id }),
  ),

  on(
    MembersActions.addMemberSucceeded,
    MembersActions.updateMemberSucceeded,
    (state, { member }): MembersState =>
      membersAdapter.upsertOne(member, {
        ...state,
        memberId: null,
        memberFormData: null,
      }),
  ),

  on(
    MembersActions.deleteMemberSucceeded,
    (state, { member }): MembersState =>
      membersAdapter.removeOne(member.id!, {
        ...state,
        memberId: null,
        memberFormData: null,
      }),
  ),

  on(MembersActions.formValueChanged, (state, { value }): MembersState => {
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
      memberId: null,
      memberFormData: null,
      controlMode: null,
    }),
  ),
);
