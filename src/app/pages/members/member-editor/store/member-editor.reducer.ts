import { createReducer, on, Action } from '@ngrx/store';

import * as MemberEditorActions from './member-editor.actions';
import { MemberEditorState } from './member-editor.state';
import { newMemberFormTemplate } from '../../types/member.model';

const initialState: MemberEditorState = {
  memberBeforeEdit: newMemberFormTemplate,
  memberAfterEdit: null,
  isEditMode: false,
  hasUnsavedChanges: false,
};

const memberEditorReducer = createReducer(
  initialState,
  on(MemberEditorActions.memberToEditReceived, (state, action) => ({
    ...state,
    memberBeforeEdit: action.memberToEdit,
    isEditMode: true,
  })),
  on(MemberEditorActions.addMemberSelected, (state, action) => ({
    ...state,
    memberAfterEdit: action.memberToAdd,
    hasUnsavedChanges: false,
  })),
  on(MemberEditorActions.addMemberSucceeded, () => initialState),
  on(MemberEditorActions.addMemberFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(MemberEditorActions.updateMemberSelected, (state, action) => ({
    ...state,
    memberAfterEdit: action.memberToUpdate,
  })),
  on(MemberEditorActions.updateMemberSucceeded, () => initialState),
  on(MemberEditorActions.updateMemberFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(MemberEditorActions.cancelConfirmed, () => initialState),
  on(MemberEditorActions.unsavedChangesDetected, (state) => ({
    ...state,
    hasUnsavedChanges: true,
  })),
  on(MemberEditorActions.noUnsavedChangesDetected, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  }))
);

export function reducer(state: MemberEditorState, action: Action) {
  return memberEditorReducer(state, action);
}
