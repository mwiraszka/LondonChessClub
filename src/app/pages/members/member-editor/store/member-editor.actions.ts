import { createAction, props } from '@ngrx/store';

import { Member } from '../../types/member.model';

enum MemberEditorActionTypes {
  MEMBER_TO_EDIT_RECEIVED = '[Member Editor] Member to edit received',
  GET_MEMBER_TO_EDIT_SUCCEEDED = '[Member Editor] Get member to edit succeeded',
  RESET_MEMBER_FORM = '[Member Editor] Reset member form',

  ADD_MEMBER_SELECTED = '[Member Editor] Add member selected',
  ADD_MEMBER_CONFIRMED = '[Member Editor] Add member confirmed',
  ADD_MEMBER_CANCELLED = '[Member Editor] Add member cancelled',
  ADD_MEMBER_SUCCEEDED = '[Member Editor] Add member succeeded',
  ADD_MEMBER_FAILED = '[Member Editor] Add member failed',

  UPDATE_MEMBER_SELECTED = '[Member Editor] Update member selected',
  UPDATE_MEMBER_CONFIRMED = '[Member Editor] Update member confirmed',
  UPDATE_MEMBER_CANCELLED = '[Member Editor] Update member cancelled',
  UPDATE_MEMBER_SUCCEEDED = '[Member Editor] Update member succeeded',
  UPDATE_MEMBER_FAILED = '[Member Editor] Update member failed',

  CANCEL_SELECTED = '[Member Editor] Cancel selected',
  CANCEL_CONFIRMED = '[Member Editor] Cancel confirmed',

  UNSAVED_CHANGES_DETECTED = '[Member Editor] Unsaved changes detected',
  NO_UNSAVED_CHANGES_DETECTED = '[Member Editor] No unsaved changes detected',

  FORM_DATA_CHANGED = '[Member Editor] Form data changed',
}

export const memberToEditReceived = createAction(
  MemberEditorActionTypes.MEMBER_TO_EDIT_RECEIVED,
  props<{ memberToEdit: Member }>()
);
export const getMemberToEditSucceeded = createAction(
  MemberEditorActionTypes.GET_MEMBER_TO_EDIT_SUCCEEDED,
  props<{ memberToEdit: Member }>()
);
export const resetMemberForm = createAction(MemberEditorActionTypes.RESET_MEMBER_FORM);

export const addMemberSelected = createAction(
  MemberEditorActionTypes.ADD_MEMBER_SELECTED,
  props<{ memberToAdd: Member }>()
);
export const addMemberConfirmed = createAction(
  MemberEditorActionTypes.ADD_MEMBER_CONFIRMED
);
export const addMemberCancelled = createAction(
  MemberEditorActionTypes.ADD_MEMBER_CANCELLED
);
export const addMemberSucceeded = createAction(
  MemberEditorActionTypes.ADD_MEMBER_SUCCEEDED,
  props<{ addedMember: Member }>()
);
export const addMemberFailed = createAction(
  MemberEditorActionTypes.ADD_MEMBER_FAILED,
  props<{ errorMessage: string }>()
);

export const updateMemberSelected = createAction(
  MemberEditorActionTypes.UPDATE_MEMBER_SELECTED,
  props<{ memberToUpdate: Member }>()
);
export const updateMemberConfirmed = createAction(
  MemberEditorActionTypes.UPDATE_MEMBER_CONFIRMED
);
export const updateMemberCancelled = createAction(
  MemberEditorActionTypes.UPDATE_MEMBER_CANCELLED
);
export const updateMemberSucceeded = createAction(
  MemberEditorActionTypes.UPDATE_MEMBER_SUCCEEDED,
  props<{ updatedMember: Member }>()
);
export const updateMemberFailed = createAction(
  MemberEditorActionTypes.UPDATE_MEMBER_FAILED,
  props<{ errorMessage: string }>()
);

export const cancelSelected = createAction(MemberEditorActionTypes.CANCEL_SELECTED);
export const cancelConfirmed = createAction(MemberEditorActionTypes.CANCEL_CONFIRMED);

export const formDataChanged = createAction(
  MemberEditorActionTypes.FORM_DATA_CHANGED,
  props<{ formData: Member }>()
);
