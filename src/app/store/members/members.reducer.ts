import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import {
  INITIAL_COLLECTION_DISPLAY_OPTIONS,
  INITIAL_MEMBER_FORM_DATA,
  MEMBER_FORM_DATA_PROPERTIES,
} from '@app/constants';
import type {
  CollectionDisplayOptions,
  IsoDate,
  Member,
  MemberFormData,
} from '@app/models';

import * as MembersActions from './members.actions';

export interface MembersState
  extends EntityState<{ member: Member; formData: MemberFormData }> {
  lastFetch: IsoDate | null;
  newMemberFormData: MemberFormData;
  options: CollectionDisplayOptions<Member>;
  totalMemberCount: number;
}

export const membersAdapter = createEntityAdapter<{
  member: Member;
  formData: MemberFormData;
}>({
  selectId: ({ member }) => member.id,
});

export const initialState: MembersState = membersAdapter.getInitialState({
  lastFetch: null,
  newMemberFormData: INITIAL_MEMBER_FORM_DATA,
  options: INITIAL_COLLECTION_DISPLAY_OPTIONS,
  totalMemberCount: 0,
});

export const membersReducer = createReducer(
  initialState,

  on(
    MembersActions.fetchMembersSucceeded,
    (state, { members, totalCount, totalMemberCount }): MembersState =>
      membersAdapter.setAll(
        members.map(member => ({
          member,
          formData: pick(member, MEMBER_FORM_DATA_PROPERTIES),
        })),
        { 
          ...state, 
          lastFetch: new Date().toISOString(),
          options: {
            ...state.options,
            totalItems: totalCount,
          },
          totalMemberCount,
        },
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

  on(
    MembersActions.pageChanged,
    (state, { pageNum }): MembersState => ({
      ...state,
      options: { ...state.options, pageNum },
    }),
  ),

  on(
    MembersActions.pageSizeChanged,
    (state, { pageSize }): MembersState => ({
      ...state,
      options: { ...state.options, pageSize, pageNum: 1 },
    }),
  ),

  on(
    MembersActions.tableHeaderSelected,
    (state, { header }): MembersState => ({
      ...state,
      options: {
        ...state.options,
        sortedBy: header,
        isAscending:
          header === state.options.sortedBy
            ? !state.options.isAscending
            : state.options.isAscending,
        pageNum: 1,
      },
    }),
  ),

  on(
    MembersActions.filtersChanged,
    (state, { filters }): MembersState => ({
      ...state,
      options: {
        ...state.options,
        pageNum: 1,
        filters,
      },
    }),
  ),

  on(
    MembersActions.searchQueryChanged,
    (state, { searchQuery }): MembersState => ({
      ...state,
      options: { ...state.options, searchQuery, pageNum: 1 },
    }),
  ),
);
