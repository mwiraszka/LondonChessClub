import { createAction, props } from '@ngrx/store';

import { Member } from '@app/shared/types';

enum MemberEditorScreenActionTypes {
  MEMBER_TO_EDIT_RECEIVED = '[Member Editor Screen] Member to edit received',
  GET_MEMBER_TO_EDIT_SUCCEEDED = '[Member Editor Screen] Get member to edit succeeded',
  RESET_MEMBER_FORM = '[Member Editor Screen] Reset member form',

  ADD_MEMBER_SELECTED = '[Member Editor Screen] Add member selected',
  ADD_MEMBER_CONFIRMED = '[Member Editor Screen] Add member confirmed',
  ADD_MEMBER_CANCELLED = '[Member Editor Screen] Add member cancelled',
  ADD_MEMBER_SUCCEEDED = '[Member Editor Screen] Add member succeeded',
  ADD_MEMBER_FAILED = '[Member Editor Screen] Add member failed',

  UPDATE_MEMBER_SELECTED = '[Member Editor Screen] Update member selected',
  UPDATE_MEMBER_CONFIRMED = '[Member Editor Screen] Update member confirmed',
  UPDATE_MEMBER_CANCELLED = '[Member Editor Screen] Update member cancelled',
  UPDATE_MEMBER_SUCCEEDED = '[Member Editor Screen] Update member succeeded',
  UPDATE_MEMBER_FAILED = '[Member Editor Screen] Update member failed',

  CANCEL_SELECTED = '[Member Editor Screen] Cancel selected',
  CANCEL_CONFIRMED = '[Member Editor Screen] Cancel confirmed',

  FORM_DATA_CHANGED = '[Member Editor Screen] Form data changed',
}

export const memberToEditReceived = createAction(
  MemberEditorScreenActionTypes.MEMBER_TO_EDIT_RECEIVED,
  props<{ memberToEdit: Member }>()
);
export const getMemberToEditSucceeded = createAction(
  MemberEditorScreenActionTypes.GET_MEMBER_TO_EDIT_SUCCEEDED,
  props<{ memberToEdit: Member }>()
);
export const resetMemberForm = createAction(
  MemberEditorScreenActionTypes.RESET_MEMBER_FORM
);

export const addMemberSelected = createAction(
  MemberEditorScreenActionTypes.ADD_MEMBER_SELECTED,
  props<{ memberToAdd: Member }>()
);
export const addMemberConfirmed = createAction(
  MemberEditorScreenActionTypes.ADD_MEMBER_CONFIRMED
);
export const addMemberCancelled = createAction(
  MemberEditorScreenActionTypes.ADD_MEMBER_CANCELLED
);
export const addMemberSucceeded = createAction(
  MemberEditorScreenActionTypes.ADD_MEMBER_SUCCEEDED,
  props<{ addedMember: Member }>()
);
export const addMemberFailed = createAction(
  MemberEditorScreenActionTypes.ADD_MEMBER_FAILED,
  props<{ error: Error }>()
);

export const updateMemberSelected = createAction(
  MemberEditorScreenActionTypes.UPDATE_MEMBER_SELECTED,
  props<{ memberToUpdate: Member }>()
);
export const updateMemberConfirmed = createAction(
  MemberEditorScreenActionTypes.UPDATE_MEMBER_CONFIRMED
);
export const updateMemberCancelled = createAction(
  MemberEditorScreenActionTypes.UPDATE_MEMBER_CANCELLED
);
export const updateMemberSucceeded = createAction(
  MemberEditorScreenActionTypes.UPDATE_MEMBER_SUCCEEDED,
  props<{ updatedMember: Member }>()
);
export const updateMemberFailed = createAction(
  MemberEditorScreenActionTypes.UPDATE_MEMBER_FAILED,
  props<{ error: Error }>()
);

export const cancelSelected = createAction(MemberEditorScreenActionTypes.CANCEL_SELECTED);
export const cancelConfirmed = createAction(
  MemberEditorScreenActionTypes.CANCEL_CONFIRMED
);

export const formDataChanged = createAction(
  MemberEditorScreenActionTypes.FORM_DATA_CHANGED,
  props<{ formData: Member }>()
);
