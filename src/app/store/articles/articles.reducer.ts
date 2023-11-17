import { Action, createReducer, on } from '@ngrx/store';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,
  on(ArticlesActions.loadArticlesStarted, state => ({
    ...state,
    isLoading: true,
  })),

  on(ArticlesActions.loadArticlesSucceeded, (state, action) => ({
    ...state,
    articles: action.allArticles,
    isLoading: false,
  })),

  on(ArticlesActions.loadArticlesFailed, state => ({
    ...state,
    isLoading: false,
  })),

  on(ArticlesActions.articleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.article,
  })),

  on(ArticlesActions.getArticleImageUrlSucceeded, (state, action) => ({
    ...state,
    articleBeforeEdit: { ...state.articleBeforeEdit, imageUrl: action.imageUrl },
  })),

  on(ArticlesActions.editArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToEdit,
    articleBeforeEdit: action.articleToEdit,
    articleCurrently: action.articleToEdit,
    isEditMode: true,
  })),

  on(ArticlesActions.deleteArticleSelected, (state, action) => ({
    ...state,
    selectedArticle: action.articleToDelete,
  })),

  on(ArticlesActions.deleteArticleSucceeded, (state, action) => ({
    ...state,
    articles: state.articles.filter(x => x.id != action.deletedArticle.id),
    selectedArticle: null,
  })),

  on(ArticlesActions.deleteArticleFailed, state => ({
    ...state,
    selectedArticle: null,
  })),

  on(ArticlesActions.deleteArticleCancelled, state => ({
    ...state,
    selectedArticle: null,
  })),

  on(
    ArticlesActions.resetArticleForm,
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.publishArticleFailed,
    ArticlesActions.updateArticleSucceeded,
    ArticlesActions.updateArticleFailed,
    ArticlesActions.cancelConfirmed,
    state => ({
      ...state,
      articleBeforeEdit: initialState.articleBeforeEdit,
      articleCurrently: initialState.articleCurrently,
      isEditMode: false,
    }),
  ),

  on(ArticlesActions.formDataChanged, (state, action) => ({
    ...state,
    articleCurrently: action.article,
  })),
);

export function reducer(state: ArticlesState, action: Action): ArticlesState {
  return articlesReducer(state, action);
}
