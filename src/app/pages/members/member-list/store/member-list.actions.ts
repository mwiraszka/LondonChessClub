import { createAction, props } from '@ngrx/store';

import { Member } from '../../types/member.model';

enum MemberListActionTypes {
  LOAD_MEMBERS_STARTED = '[Member List] Load members started',
  LOAD_MEMBERS_SUCCEEDED = '[Member List] Load members succeeded',
  LOAD_MEMBERS_FAILED = '[Member List] Load members failed',

  CREATE_MEMBER_SELECTED = '[Member List] Create member selected',
  EDIT_MEMBER_SELECTED = '[Member List] Edit member selected',

  DELETE_MEMBER_SELECTED = '[Member List] Delete member selected',
  DELETE_MEMBER_CONFIRMED = '[Member List] Delete member confirmed',
  DELETE_MEMBER_CANCELLED = '[Member List] Delete member cancelled',
  DELETE_MEMBER_SUCCEEDED = '[Member List] Delete member succeeded',
  DELETE_MEMBER_FAILED = '[Member List] Delete member failed',
}

export const loadMembersStarted = createAction(
  MemberListActionTypes.LOAD_MEMBERS_STARTED
);
export const loadMembersSucceeded = createAction(
  MemberListActionTypes.LOAD_MEMBERS_SUCCEEDED,
  props<{ allMembers: Member[] }>()
);
export const loadMembersFailed = createAction(
  MemberListActionTypes.LOAD_MEMBERS_FAILED,
  props<{ errorMessage: string }>()
);

export const createMemberSelected = createAction(
  MemberListActionTypes.CREATE_MEMBER_SELECTED
);
export const editMemberSelected = createAction(
  MemberListActionTypes.EDIT_MEMBER_SELECTED,
  props<{ memberToEdit: Member }>()
);

export const deleteMemberSelected = createAction(
  MemberListActionTypes.DELETE_MEMBER_SELECTED,
  props<{ memberToDelete: Member }>()
);
export const deleteMemberConfirmed = createAction(
  MemberListActionTypes.DELETE_MEMBER_CONFIRMED
);
export const deleteMemberCancelled = createAction(
  MemberListActionTypes.DELETE_MEMBER_CANCELLED
);
export const deleteMemberSucceeded = createAction(
  MemberListActionTypes.DELETE_MEMBER_SUCCEEDED,
  props<{ deletedMember: Member }>()
);
export const deleteMemberFailed = createAction(
  MemberListActionTypes.DELETE_MEMBER_FAILED,
  props<{ errorMessage: string }>()
);
