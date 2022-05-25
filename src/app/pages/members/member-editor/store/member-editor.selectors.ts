import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';
import { areSame } from '@app/shared/utils';

import { MemberEditorState } from './member-editor.state';

export const memberEditorFeatureSelector = createFeatureSelector<MemberEditorState>(
  AppStoreFeatureTypes.MEMBER_EDITOR
);

export const memberBeforeEdit = createSelector(
  memberEditorFeatureSelector,
  (state) => state.memberBeforeEdit
);

export const memberCurrently = createSelector(
  memberEditorFeatureSelector,
  (state) => state.memberCurrently
);

export const isEditMode = createSelector(
  memberEditorFeatureSelector,
  (state) => state.isEditMode
);

export const hasUnsavedChanges = createSelector(
  memberEditorFeatureSelector,
  (state) => !areSame(state.memberCurrently, state.memberBeforeEdit)
);
