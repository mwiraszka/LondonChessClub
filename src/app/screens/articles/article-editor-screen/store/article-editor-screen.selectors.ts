import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';
import { areSame } from '@app/shared/utils';

import { ArticleEditorScreenState } from './article-editor-screen.state';

export const articleEditorScreenFeatureSelector =
  createFeatureSelector<ArticleEditorScreenState>(
    AppStoreFeatureTypes.ARTICLE_EDITOR_SCREEN
  );

export const articleBeforeEdit = createSelector(
  articleEditorScreenFeatureSelector,
  (state) => state.articleBeforeEdit
);

export const articleCurrently = createSelector(
  articleEditorScreenFeatureSelector,
  (state) => state.articleCurrently
);

export const isEditMode = createSelector(
  articleEditorScreenFeatureSelector,
  (state) => state.isEditMode
);

export const hasUnsavedChanges = createSelector(
  articleEditorScreenFeatureSelector,
  (state) => !areSame(state.articleCurrently, state.articleBeforeEdit)
);
