import { createAction, props } from '@ngrx/store';

import { Member } from '@app/shared/types';

enum MemberListScreenActionTypes {
  LOAD_MEMBERS_STARTED = '[Member List Screen] Load members started',
  LOAD_MEMBERS_SUCCEEDED = '[Member List Screen] Load members succeeded',
  LOAD_MEMBERS_FAILED = '[Member List Screen] Load members failed',

  TABLE_HEADER_SELECTED = '[Member List Screen] Table header selected',
  MEMBERS_SORTED = '[Member List Screen] Members sorted',

  CREATE_MEMBER_SELECTED = '[Member List Screen] Create member selected',
  EDIT_MEMBER_SELECTED = '[Member List Screen] Edit member selected',

  DELETE_MEMBER_SELECTED = '[Member List Screen] Delete member selected',
  DELETE_MEMBER_CONFIRMED = '[Member List Screen] Delete member confirmed',
  DELETE_MEMBER_CANCELLED = '[Member List Screen] Delete member cancelled',
  DELETE_MEMBER_SUCCEEDED = '[Member List Screen] Delete member succeeded',
  DELETE_MEMBER_FAILED = '[Member List Screen] Delete member failed',
}

export const loadMembersStarted = createAction(
  MemberListScreenActionTypes.LOAD_MEMBERS_STARTED
);
export const loadMembersSucceeded = createAction(
  MemberListScreenActionTypes.LOAD_MEMBERS_SUCCEEDED,
  props<{ allMembers: Member[] }>()
);
export const loadMembersFailed = createAction(
  MemberListScreenActionTypes.LOAD_MEMBERS_FAILED,
  props<{ error: Error }>()
);

export const tableHeaderSelected = createAction(
  MemberListScreenActionTypes.TABLE_HEADER_SELECTED,
  props<{ header: string }>()
);
export const membersSorted = createAction(
  MemberListScreenActionTypes.MEMBERS_SORTED,
  props<{ sortedMembers: Member[]; sortedBy: string; isAscending: boolean }>()
);

export const createMemberSelected = createAction(
  MemberListScreenActionTypes.CREATE_MEMBER_SELECTED
);
export const editMemberSelected = createAction(
  MemberListScreenActionTypes.EDIT_MEMBER_SELECTED,
  props<{ memberToEdit: Member }>()
);

export const deleteMemberSelected = createAction(
  MemberListScreenActionTypes.DELETE_MEMBER_SELECTED,
  props<{ memberToDelete: Member }>()
);
export const deleteMemberConfirmed = createAction(
  MemberListScreenActionTypes.DELETE_MEMBER_CONFIRMED
);
export const deleteMemberCancelled = createAction(
  MemberListScreenActionTypes.DELETE_MEMBER_CANCELLED
);
export const deleteMemberSucceeded = createAction(
  MemberListScreenActionTypes.DELETE_MEMBER_SUCCEEDED,
  props<{ deletedMember: Member }>()
);
export const deleteMemberFailed = createAction(
  MemberListScreenActionTypes.DELETE_MEMBER_FAILED,
  props<{ error: Error }>()
);
