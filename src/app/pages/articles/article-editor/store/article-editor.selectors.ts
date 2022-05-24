import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';
import { areSame } from '@app/shared/utils';

import { ArticleEditorState } from './article-editor.state';

export const articleEditorFeatureSelector = createFeatureSelector<ArticleEditorState>(
  AppStoreFeatureTypes.ARTICLE_EDITOR
);

export const articleBeforeEdit = createSelector(
  articleEditorFeatureSelector,
  (state) => state.articleBeforeEdit
);

export const articleCurrently = createSelector(
  articleEditorFeatureSelector,
  (state) => state.articleCurrently
);

export const isEditMode = createSelector(
  articleEditorFeatureSelector,
  (state) => state.isEditMode
);

export const hasUnsavedChanges = createSelector(
  articleEditorFeatureSelector,
  (state) => !areSame(state.articleCurrently, state.articleBeforeEdit)
);
