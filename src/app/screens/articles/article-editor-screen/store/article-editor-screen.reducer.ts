import { createReducer, on, Action } from '@ngrx/store';

import * as ArticleEditorScreenActions from './article-editor-screen.actions';
import { ArticleEditorScreenState } from './article-editor-screen.state';
import { newArticleFormTemplate } from '../../types/article.model';

const initialState: ArticleEditorScreenState = {
  articleBeforeEdit: newArticleFormTemplate,
  articleCurrently: newArticleFormTemplate,
  isEditMode: false,
};

const articleEditorScreenReducer = createReducer(
  initialState,
  on(ArticleEditorScreenActions.articleToEditReceived, (state, action) => ({
    ...state,
    articleBeforeEdit: action.articleToEdit,
    articleCurrently: action.articleToEdit,
    isEditMode: true,
  })),
  on(ArticleEditorScreenActions.resetArticleForm, () => initialState),
  on(ArticleEditorScreenActions.publishArticleSelected, (state, action) => ({
    ...state,
    articleCurrently: action.articleToPublish,
  })),
  on(ArticleEditorScreenActions.publishArticleSucceeded, () => initialState),
  on(ArticleEditorScreenActions.publishArticleFailed, () => initialState),
  on(ArticleEditorScreenActions.updateArticleSelected, (state, action) => ({
    ...state,
    articleCurrently: action.articleToUpdate,
  })),
  on(ArticleEditorScreenActions.updateArticleSucceeded, () => initialState),
  on(ArticleEditorScreenActions.updateArticleFailed, () => initialState),
  on(ArticleEditorScreenActions.cancelConfirmed, () => initialState),
  on(ArticleEditorScreenActions.formDataChanged, (state, action) => ({
    ...state,
    articleCurrently: action.formData,
  }))
);

export function reducer(state: ArticleEditorScreenState, action: Action) {
  return articleEditorScreenReducer(state, action);
}
