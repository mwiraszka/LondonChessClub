import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import { INITIAL_MEMBER_FORM_DATA, MEMBER_FORM_DATA_PROPERTIES } from '@app/constants';
import {
  CallState,
  DataPaginationOptions,
  IsoDate,
  Member,
  MemberFormData,
} from '@app/models';

import * as MembersActions from './members.actions';

export interface MembersState
  extends EntityState<{ member: Member; formData: MemberFormData }> {
  callState: CallState;
  newMemberFormData: MemberFormData;
  lastFullFetch: IsoDate | null;
  lastFilteredFetch: IsoDate | null;
  filteredMembers: Member[];
  options: DataPaginationOptions<Member>;
  filteredCount: number | null;
  totalCount: number;
}

export const membersAdapter = createEntityAdapter<{
  member: Member;
  formData: MemberFormData;
}>({
  selectId: ({ member }) => member.id,
});

export const initialState: MembersState = membersAdapter.getInitialState({
  callState: 'idle',
  newMemberFormData: INITIAL_MEMBER_FORM_DATA,
  lastFullFetch: null,
  lastFilteredFetch: null,
  filteredMembers: [],
  options: {
    page: 1,
    pageSize: 20,
    sortBy: 'rating',
    sortOrder: 'desc',
    filters: {
      isActive: {
        label: 'Show inactive members',
        value: false,
      },
    },
    search: '',
  },
  filteredCount: null,
  totalCount: 0,
});

export const membersReducer = createReducer(
  initialState,

  on(
    MembersActions.fetchAllMembersRequested,
    MembersActions.fetchFilteredMembersRequested,
    MembersActions.fetchMemberRequested,
    MembersActions.addMemberRequested,
    MembersActions.updateMemberRequested,
    MembersActions.deleteMemberRequested,
    MembersActions.updateMemberRatingsRequested,
    (state): MembersState => ({
      ...state,
      callState: 'loading',
    }),
  ),

  on(
    MembersActions.fetchAllMembersFailed,
    MembersActions.fetchFilteredMembersFailed,
    MembersActions.fetchMemberFailed,
    MembersActions.addMemberFailed,
    MembersActions.updateMemberFailed,
    MembersActions.deleteMemberFailed,
    MembersActions.updateMemberRatingsFailed,
    (state): MembersState => ({
      ...state,
      callState: 'error',
    }),
  ),

  on(
    MembersActions.fetchAllMembersSucceeded,
    (state, { members, totalCount }): MembersState =>
      membersAdapter.setAll(
        members.map(member => ({
          member,
          formData: pick(member, MEMBER_FORM_DATA_PROPERTIES),
        })),
        {
          ...state,
          callState: 'idle',
          lastFullFetch: new Date().toISOString(),
          totalCount,
        },
      ),
  ),

  on(
    MembersActions.fetchFilteredMembersSucceeded,
    (state, { members, filteredCount, totalCount }): MembersState => {
      return membersAdapter.upsertMany(
        members.map(member => ({
          member,
          formData: pick(member, MEMBER_FORM_DATA_PROPERTIES),
        })),
        {
          ...state,
          callState: 'idle',
          lastFilteredFetch: new Date(Date.now()).toISOString(),
          filteredMembers: members,
          filteredCount,
          totalCount,
        },
      );
    },
  ),

  on(MembersActions.fetchMemberSucceeded, (state, { member }): MembersState => {
    const previousFormData = state.entities[member.id]?.formData;
    return membersAdapter.upsertOne(
      {
        member,
        formData: previousFormData ?? pick(member, MEMBER_FORM_DATA_PROPERTIES),
      },
      { ...state, callState: 'idle' },
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
        { ...state, callState: 'idle', newMemberFormData: INITIAL_MEMBER_FORM_DATA },
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
        { ...state, callState: 'idle', lastFilteredFetch: null },
      ),
  ),

  on(
    MembersActions.updateMemberRatingsSucceeded,
    (state, { members }): MembersState =>
      membersAdapter.upsertMany(
        members.map(member => ({
          member,
          formData: pick(member, MEMBER_FORM_DATA_PROPERTIES),
        })),
        { ...state, callState: 'idle', lastFilteredFetch: null },
      ),
  ),

  on(
    MembersActions.deleteMemberSucceeded,
    (state, { memberId }): MembersState =>
      membersAdapter.removeOne(memberId, {
        ...state,
        callState: 'idle',
        lastFilteredFetch: null,
      }),
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

  on(
    MembersActions.paginationOptionsChanged,
    (state, { options }): MembersState => ({
      ...state,
      options,
    }),
  ),

  on(MembersActions.memberFormDataReset, (state, { memberId }): MembersState => {
    const originalMember = memberId ? state.entities[memberId]?.member : null;

    if (!originalMember) {
      return {
        ...state,
        newMemberFormData: INITIAL_MEMBER_FORM_DATA,
      };
    }

    return membersAdapter.upsertOne(
      {
        member: originalMember,
        formData: pick(originalMember, MEMBER_FORM_DATA_PROPERTIES),
      },
      state,
    );
  }),
);
