import { createReducer, on, Action } from '@ngrx/store';

import * as ArticleEditorActions from './article-editor.actions';
import { ArticleEditorState } from './article-editor.state';
import { newArticleFormTemplate } from '../../types/article.model';

const initialState: ArticleEditorState = {
  articleBeforeEdit: newArticleFormTemplate,
  articleCurrently: newArticleFormTemplate,
  isEditMode: false,
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
  })),
  on(ArticleEditorActions.publishArticleSucceeded, () => initialState),
  on(ArticleEditorActions.publishArticleFailed, () => initialState),
  on(ArticleEditorActions.updateArticleSelected, (state, action) => ({
    ...state,
    articleCurrently: action.articleToUpdate,
  })),
  on(ArticleEditorActions.updateArticleSucceeded, () => initialState),
  on(ArticleEditorActions.updateArticleFailed, () => initialState),
  on(ArticleEditorActions.cancelConfirmed, () => initialState),
  on(ArticleEditorActions.formDataChanged, (state, action) => ({
    ...state,
    articleCurrently: action.formData,
  }))
);

export function reducer(state: ArticleEditorState, action: Action) {
  return articleEditorReducer(state, action);
}
