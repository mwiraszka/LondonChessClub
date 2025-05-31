import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';
import moment from 'moment-timezone';

import {
  MEMBER_FORM_DATA_PROPERTIES,
  type Member,
  type MemberFormData,
} from '@app/models';

import * as MembersActions from './members.actions';

export const INITIAL_MEMBER_FORM_DATA: MemberFormData = {
  firstName: '',
  lastName: '',
  city: 'London',
  rating: '1000/0',
  peakRating: '',
  dateJoined: moment().toISOString(),
  isActive: true,
  chessComUsername: '',
  lichessUsername: '',
  yearOfBirth: '',
  email: '',
  phoneNumber: '',
};

export interface MembersState
  extends EntityState<{ member: Member; formData: MemberFormData }> {
  newMemberFormData: MemberFormData;
  sortedBy: string;
  isAscending: boolean;
  pageNum: number;
  pageSize: number;
  showActiveOnly: boolean;
}

export const membersAdapter = createEntityAdapter<{
  member: Member;
  formData: MemberFormData;
}>({
  selectId: ({ member }) => member.id,
});

export const initialState: MembersState = membersAdapter.getInitialState({
  newMemberFormData: INITIAL_MEMBER_FORM_DATA,
  sortedBy: 'rating',
  isAscending: false,
  pageNum: 1,
  pageSize: 20,
  showActiveOnly: true,
});

export const membersReducer = createReducer(
  initialState,

  on(
    MembersActions.fetchMembersSucceeded,
    (state, { members }): MembersState =>
      membersAdapter.setAll(
        members.map(member => ({
          member,
          formData: pick(member, MEMBER_FORM_DATA_PROPERTIES),
        })),
        state,
      ),
  ),

  on(MembersActions.fetchMemberSucceeded, (state, { member }): MembersState => {
    const previousFormData = state.entities[member.id]?.formData;
    return membersAdapter.upsertOne(
      {
        member,
        formData: previousFormData ?? pick(member, MEMBER_FORM_DATA_PROPERTIES),
      },
      state,
    );
  }),

  on(
    MembersActions.addMemberSucceeded,
    (state, { member }): MembersState =>
      membersAdapter.upsertOne(
        {
          member,
          formData: pick(member, MEMBER_FORM_DATA_PROPERTIES),
        },
        { ...state, newMemberFormData: INITIAL_MEMBER_FORM_DATA },
      ),
  ),

  on(
    MembersActions.updateMemberSucceeded,
    (state, { member }): MembersState =>
      membersAdapter.upsertOne(
        {
          member,
          formData: pick(member, MEMBER_FORM_DATA_PROPERTIES),
        },
        state,
      ),
  ),

  on(
    MembersActions.deleteMemberSucceeded,
    (state, { memberId }): MembersState => membersAdapter.removeOne(memberId, state),
  ),

  on(MembersActions.formValueChanged, (state, { memberId, value }): MembersState => {
    const originalMember = memberId ? state.entities[memberId] : null;

    if (!originalMember) {
      return {
        ...state,
        newMemberFormData: {
          ...state.newMemberFormData,
          ...value,
        },
      };
    }

    return membersAdapter.upsertOne(
      {
        ...originalMember,
        formData: {
          ...(originalMember?.formData ?? INITIAL_MEMBER_FORM_DATA),
          ...value,
        },
      },
      state,
    );
  }),

  on(MembersActions.memberFormDataCleared, (state, { memberId }): MembersState => {
    const originalMember = memberId ? state.entities[memberId] : null;

    if (!originalMember) {
      return {
        ...state,
        newMemberFormData: INITIAL_MEMBER_FORM_DATA,
      };
    }

    return membersAdapter.upsertOne(
      {
        ...originalMember,
        formData: INITIAL_MEMBER_FORM_DATA,
      },
      state,
    );
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
      isAscending: header === state.sortedBy ? !state.isAscending : state.isAscending,
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
);
