import { createAction, props } from '@ngrx/store';

import type { Member } from '@app/types';

enum MembersActionTypes {
  MEMBERS_SCREEN_ENTERED = '[Members] Members screen entered',

  FETCH_MEMBERS_REQUESTED = '[Members] Fetch members requested',
  FETCH_MEMBERS_SUCCEEDED = '[Members] Fetch members succeeded',
  FETCH_MEMBERS_FAILED = '[Members] Fetch members failed',

  FETCH_MEMBER_FOR_EDIT_SCREEN_REQUESTED = '[Members] Fetch member for edit screen requested',
  FETCH_MEMBER_FOR_EDIT_SCREEN_SUCCEEDED = '[Members] Fetch member for edit screen succeeded',
  FETCH_MEMBER_FOR_EDIT_SCREEN_FAILED = '[Members] Fetch member for edit screen failed',
  MEMBER_SET_FOR_EDITING = '[Members] Member set for editing',

  TABLE_HEADER_SELECTED = '[Members] Table header selected',
  MEMBERS_SORTED = '[Members] Members sorted',
  PAGE_CHANGED = '[Members] Page changed',
  PAGE_SIZE_CHANGED = '[Members] Page size changed',
  INACTIVE_MEMBERS_TOGGLED = '[Members] Inactive members toggled',

  DELETE_MEMBER_SELECTED = '[Members] Delete member selected',
  DELETE_MEMBER_CONFIRMED = '[Members] Delete member confirmed',
  DELETE_MEMBER_CANCELLED = '[Members] Delete member cancelled',
  DELETE_MEMBER_SUCCEEDED = '[Members] Delete member succeeded',
  DELETE_MEMBER_FAILED = '[Members] Delete member failed',

  ADD_MEMBER_SELECTED = '[Members] Add member selected',
  ADD_MEMBER_CONFIRMED = '[Members] Add member confirmed',
  ADD_MEMBER_CANCELLED = '[Members] Add member cancelled',
  ADD_MEMBER_SUCCEEDED = '[Members] Add member succeeded',
  ADD_MEMBER_FAILED = '[Members] Add member failed',

  UPDATE_MEMBER_SELECTED = '[Members] Update member selected',
  UPDATE_MEMBER_CONFIRMED = '[Members] Update member confirmed',
  UPDATE_MEMBER_CANCELLED = '[Members] Update member cancelled',
  UPDATE_MEMBER_SUCCEEDED = '[Members] Update member succeeded',
  UPDATE_MEMBER_FAILED = '[Members] Update member failed',

  CANCEL_SELECTED = '[Members] Cancel selected',
  CANCEL_CONFIRMED = '[Members] Cancel confirmed',

  FORM_DATA_CHANGED = '[Members] Form data changed',
  RESET_MEMBER_FORM = '[Members] Reset member form',
}

export const membersScreenEntered = createAction(
  MembersActionTypes.MEMBERS_SCREEN_ENTERED,
);

export const fetchMembersRequested = createAction(
  MembersActionTypes.FETCH_MEMBERS_REQUESTED,
);
export const fetchMembersSucceeded = createAction(
  MembersActionTypes.FETCH_MEMBERS_SUCCEEDED,
  props<{ allMembers: Member[] }>(),
);
export const fetchMembersFailed = createAction(
  MembersActionTypes.FETCH_MEMBERS_FAILED,
  props<{ error: Error }>(),
);

export const fetchMemberForEditScreenRequested = createAction(
  MembersActionTypes.FETCH_MEMBER_FOR_EDIT_SCREEN_REQUESTED,
  props<{ memberId: string }>(),
);
export const fetchMemberForEditScreenSucceeded = createAction(
  MembersActionTypes.FETCH_MEMBER_FOR_EDIT_SCREEN_SUCCEEDED,
  props<{ member: Member }>(),
);
export const fetchMemberForEditScreenFailed = createAction(
  MembersActionTypes.FETCH_MEMBER_FOR_EDIT_SCREEN_FAILED,
  props<{ error: Error }>(),
);
export const memberSetForEditing = createAction(
  MembersActionTypes.MEMBER_SET_FOR_EDITING,
  props<{ member: Member }>(),
);

export const tableHeaderSelected = createAction(
  MembersActionTypes.TABLE_HEADER_SELECTED,
  props<{ header: string }>(),
);
export const membersSorted = createAction(
  MembersActionTypes.MEMBERS_SORTED,
  props<{ sortedMembers: Member[]; sortedBy: string; isAscending: boolean }>(),
);
export const pageChanged = createAction(
  MembersActionTypes.PAGE_CHANGED,
  props<{ pageNum: number }>(),
);
export const pageSizeChanged = createAction(
  MembersActionTypes.PAGE_SIZE_CHANGED,
  props<{ pageSize: number }>(),
);
export const inactiveMembersToggled = createAction(
  MembersActionTypes.INACTIVE_MEMBERS_TOGGLED,
);

export const deleteMemberSelected = createAction(
  MembersActionTypes.DELETE_MEMBER_SELECTED,
  props<{ memberToDelete: Member }>(),
);
export const deleteMemberConfirmed = createAction(
  MembersActionTypes.DELETE_MEMBER_CONFIRMED,
);
export const deleteMemberCancelled = createAction(
  MembersActionTypes.DELETE_MEMBER_CANCELLED,
);
export const deleteMemberSucceeded = createAction(
  MembersActionTypes.DELETE_MEMBER_SUCCEEDED,
  props<{ deletedMember: Member }>(),
);
export const deleteMemberFailed = createAction(
  MembersActionTypes.DELETE_MEMBER_FAILED,
  props<{ error: Error }>(),
);

export const addMemberSelected = createAction(
  MembersActionTypes.ADD_MEMBER_SELECTED,
  props<{ memberToAdd: Member }>(),
);
export const addMemberConfirmed = createAction(MembersActionTypes.ADD_MEMBER_CONFIRMED);
export const addMemberCancelled = createAction(MembersActionTypes.ADD_MEMBER_CANCELLED);
export const addMemberSucceeded = createAction(
  MembersActionTypes.ADD_MEMBER_SUCCEEDED,
  props<{ addedMember: Member }>(),
);
export const addMemberFailed = createAction(
  MembersActionTypes.ADD_MEMBER_FAILED,
  props<{ error: Error }>(),
);

export const updateMemberSelected = createAction(
  MembersActionTypes.UPDATE_MEMBER_SELECTED,
  props<{ memberToUpdate: Member }>(),
);
export const updateMemberConfirmed = createAction(
  MembersActionTypes.UPDATE_MEMBER_CONFIRMED,
);
export const updateMemberCancelled = createAction(
  MembersActionTypes.UPDATE_MEMBER_CANCELLED,
);
export const updateMemberSucceeded = createAction(
  MembersActionTypes.UPDATE_MEMBER_SUCCEEDED,
  props<{ updatedMember: Member }>(),
);
export const updateMemberFailed = createAction(
  MembersActionTypes.UPDATE_MEMBER_FAILED,
  props<{ error: Error }>(),
);

export const cancelSelected = createAction(MembersActionTypes.CANCEL_SELECTED);

export const formDataChanged = createAction(
  MembersActionTypes.FORM_DATA_CHANGED,
  props<{ member: Member }>(),
);
export const resetMemberForm = createAction(MembersActionTypes.RESET_MEMBER_FORM);
