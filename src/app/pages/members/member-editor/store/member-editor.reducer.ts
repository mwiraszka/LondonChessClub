import { createReducer, on, Action } from '@ngrx/store';

import { areSame } from '@app/shared/utils';

import * as MemberEditorActions from './member-editor.actions';
import { MemberEditorState } from './member-editor.state';
import { newMemberFormTemplate } from '../../types/member.model';

const initialState: MemberEditorState = {
  memberBeforeEdit: newMemberFormTemplate,
  memberCurrently: newMemberFormTemplate,
  isEditMode: false,
  hasUnsavedChanges: false,
};

const memberEditorReducer = createReducer(
  initialState,
  on(MemberEditorActions.memberToEditReceived, (state, action) => ({
    ...state,
    memberBeforeEdit: action.memberToEdit,
    memberCurrently: action.memberToEdit,
    isEditMode: true,
  })),
  on(MemberEditorActions.resetMemberForm, () => initialState),
  on(MemberEditorActions.addMemberSelected, (state, action) => ({
    ...state,
    memberCurrently: action.memberToAdd,
    hasUnsavedChanges: false,
  })),
  on(MemberEditorActions.addMemberSucceeded, () => initialState),
  on(MemberEditorActions.addMemberFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(MemberEditorActions.updateMemberSelected, (state, action) => ({
    ...state,
    memberCurrently: action.memberToUpdate,
  })),
  on(MemberEditorActions.updateMemberSucceeded, () => initialState),
  on(MemberEditorActions.updateMemberFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(MemberEditorActions.cancelConfirmed, () => initialState),
  on(MemberEditorActions.formDataChanged, (state, action) => ({
    ...state,
    hasUnsavedChanges: !areSame(action.formData, state.memberBeforeEdit),
    memberCurrently: action.formData,
  }))
);

export function reducer(state: MemberEditorState, action: Action) {
  return memberEditorReducer(state, action);
}
