import { createReducer, on, Action } from '@ngrx/store';

import * as ArticleEditorActions from './article-editor.actions';
import { ArticleEditorState } from './article-editor.state';
import { newArticleFormTemplate } from '../../types/article.model';

const initialState: ArticleEditorState = {
  articleBeforeEdit: newArticleFormTemplate,
  articleAfterEdit: null,
  isEditMode: false,
  hasUnsavedChanges: false,
};

const articleEditorReducer = createReducer(
  initialState,
  on(ArticleEditorActions.articleToEditReceived, (state, action) => ({
    ...state,
    articleBeforeEdit: action.articleToEdit,
    isEditMode: true,
  })),
  on(ArticleEditorActions.publishArticleSelected, (state, action) => ({
    ...state,
    articleAfterEdit: action.articleToPublish,
    hasUnsavedChanges: false,
  })),
  on(ArticleEditorActions.publishArticleSucceeded, () => initialState),
  on(ArticleEditorActions.publishArticleFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(ArticleEditorActions.updateArticleSelected, (state, action) => ({
    ...state,
    articleAfterEdit: action.articleToUpdate,
  })),
  on(ArticleEditorActions.updateArticleSucceeded, () => initialState),
  on(ArticleEditorActions.updateArticleFailed, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  })),
  on(ArticleEditorActions.cancelConfirmed, () => initialState),
  on(ArticleEditorActions.unsavedChangesDetected, (state) => ({
    ...state,
    hasUnsavedChanges: true,
  })),
  on(ArticleEditorActions.noUnsavedChangesDetected, (state) => ({
    ...state,
    hasUnsavedChanges: false,
  }))
);

export function reducer(state: ArticleEditorState, action: Action) {
  return articleEditorReducer(state, action);
}
