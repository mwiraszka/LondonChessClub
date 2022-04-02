import { createReducer, on, Action } from '@ngrx/store';

import * as MemberEditorActions from './member-editor.actions';
import { MemberEditorState } from './member-editor.state';
import { newMemberFormTemplate } from '../../types/member.model';

const initialState: MemberEditorState = {
  memberBeforeEdit: newMemberFormTemplate,
  memberCurrently: newMemberFormTemplate,
  isEditMode: false,
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
  })),
  on(MemberEditorActions.addMemberSucceeded, () => initialState),
  on(MemberEditorActions.addMemberFailed, () => initialState),
  on(MemberEditorActions.updateMemberSelected, (state, action) => ({
    ...state,
    memberCurrently: action.memberToUpdate,
  })),
  on(MemberEditorActions.updateMemberSucceeded, () => initialState),
  on(MemberEditorActions.updateMemberFailed, () => initialState),
  on(MemberEditorActions.cancelConfirmed, () => initialState),
  on(MemberEditorActions.formDataChanged, (state, action) => ({
    ...state,
    memberCurrently: action.formData,
  }))
);

export function reducer(state: MemberEditorState, action: Action) {
  return memberEditorReducer(state, action);
}
