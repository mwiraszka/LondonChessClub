import { createReducer, on, Action } from '@ngrx/store';

import { areSame } from '@app/shared/utils';

import * as ArticleEditorActions from './article-editor.actions';
import { ArticleEditorState } from './article-editor.state';
import { newArticleFormTemplate } from '../../types/article.model';

const initialState: ArticleEditorState = {
  articleBeforeEdit: newArticleFormTemplate,
  articleCurrently: newArticleFormTemplate,
  isEditMode: false,
  hasUnsavedChanges: false,
};

const articleEditorReducer = createReducer(
  initialState,
  on(ArticleEditorActions.articleToEditReceived, (state, action) => ({
    ...state,
    articleBeforeEdit: action.articleToEdit,
    articleCurrently: action.articleToEdit,
    isEditMode: true,
  })),
  on(ArticleEditorActions.resetArticleForm, () => initialState),
  on(ArticleEditorActions.publishArticleSelected, (state, action) => ({
    ...state,
    articleCurrently: action.articleToPublish,
    hasUnsavedChanges: false,
  })),
  on(ArticleEditorActions.publishArticleSucceeded, () => initialState),
  on(ArticleEditorActions.publishArticleFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(ArticleEditorActions.updateArticleSelected, (state, action) => ({
    ...state,
    articleCurrently: action.articleToUpdate,
  })),
  on(ArticleEditorActions.updateArticleSucceeded, () => initialState),
  on(ArticleEditorActions.updateArticleFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(ArticleEditorActions.cancelConfirmed, () => initialState),
  on(ArticleEditorActions.formDataChanged, (state, action) => ({
    ...state,
    hasUnsavedChanges: !areSame(action.formData, state.articleBeforeEdit),
    memberCurrently: action.formData,
  }))
);

export function reducer(state: ArticleEditorState, action: Action) {
  return articleEditorReducer(state, action);
}
