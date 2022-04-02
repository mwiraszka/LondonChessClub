import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { ArticleEditorState } from './article-editor.state';

export const articleEditorFeatureSelector = createFeatureSelector<ArticleEditorState>(
  AppStoreFeatures.ARTICLE_EDITOR
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
  (state) => state.hasUnsavedChanges
);
