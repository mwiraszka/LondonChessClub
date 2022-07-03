import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';
import { areSame } from '@app/shared/utils';

import { MemberEditorScreenState } from './member-editor-screen.state';

export const memberEditorScreenFeatureSelector =
  createFeatureSelector<MemberEditorScreenState>(
    AppStoreFeatureTypes.MEMBER_EDITOR_SCREEN
  );

export const memberBeforeEdit = createSelector(
  memberEditorScreenFeatureSelector,
  (state) => state.memberBeforeEdit
);

export const memberCurrently = createSelector(
  memberEditorScreenFeatureSelector,
  (state) => state.memberCurrently
);

export const isEditMode = createSelector(
  memberEditorScreenFeatureSelector,
  (state) => state.isEditMode
);

export const hasUnsavedChanges = createSelector(
  memberEditorScreenFeatureSelector,
  (state) => !areSame(state.memberCurrently, state.memberBeforeEdit)
);
