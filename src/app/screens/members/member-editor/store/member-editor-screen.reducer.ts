import { createReducer, on, Action } from '@ngrx/store';

import * as MemberEditorScreenActions from './member-editor-screen.actions';
import { MemberEditorScreenState } from './member-editor-screen.state';
import { newMemberFormTemplate } from '../../types/member.model';

const initialState: MemberEditorScreenState = {
  memberBeforeEdit: newMemberFormTemplate,
  memberCurrently: newMemberFormTemplate,
  isEditMode: false,
};

const memberEditorScreenReducer = createReducer(
  initialState,
  on(MemberEditorScreenActions.memberToEditReceived, (state, action) => ({
    ...state,
    memberBeforeEdit: action.memberToEdit,
    memberCurrently: action.memberToEdit,
    isEditMode: true,
  })),
  on(MemberEditorScreenActions.resetMemberForm, () => initialState),
  on(MemberEditorScreenActions.addMemberSelected, (state, action) => ({
    ...state,
    memberCurrently: action.memberToAdd,
  })),
  on(MemberEditorScreenActions.addMemberSucceeded, () => initialState),
  on(MemberEditorScreenActions.addMemberFailed, () => initialState),
  on(MemberEditorScreenActions.updateMemberSelected, (state, action) => ({
    ...state,
    memberCurrently: action.memberToUpdate,
  })),
  on(MemberEditorScreenActions.updateMemberSucceeded, () => initialState),
  on(MemberEditorScreenActions.updateMemberFailed, () => initialState),
  on(MemberEditorScreenActions.cancelConfirmed, () => initialState),
  on(MemberEditorScreenActions.formDataChanged, (state, action) => ({
    ...state,
    memberCurrently: action.formData,
  }))
);

export function reducer(state: MemberEditorScreenState, action: Action) {
  return memberEditorScreenReducer(state, action);
}
