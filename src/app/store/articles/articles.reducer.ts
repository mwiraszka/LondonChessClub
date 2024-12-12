import { Action, createReducer, on } from '@ngrx/store';

import { type ControlModes, newArticleFormTemplate } from '@app/types';
import { sortArticles } from '@app/utils';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,

  on(ArticlesActions.fetchArticlesSucceeded, (state, { articles }) => ({
    ...state,
    articles,
  })),

  on(ArticlesActions.articleAddRequested, state => ({
    ...state,
    setArticle: newArticleFormTemplate,
    formArticle: newArticleFormTemplate,
    controlMode: 'add' as ControlModes,
  })),

  on(ArticlesActions.articleEditRequested, state => ({
    ...state,
    controlMode: 'edit' as ControlModes,
  })),

  on(ArticlesActions.articleViewRequested, state => ({
    ...state,
    controlMode: 'view' as ControlModes,
  })),

  on(ArticlesActions.articleSet, (state, { article }) => ({
    ...state,
    setArticle: article,
  })),

  on(ArticlesActions.articleUnset, state => ({
    ...state,
    setArticle: null,
    formArticle: null,
    controlMode: null,
  })),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }) => ({
      ...state,
      articles: sortArticles([
        ...state.articles.map(storedArticle =>
          storedArticle.id === article.id ? article : storedArticle,
        ),
      ]),
      setArticle: null,
      formArticle: null,
    }),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: sortArticles([
      ...state.articles.map(storedArticle =>
        storedArticle.id === article.id ? article : storedArticle,
      ),
    ]),
    setArticle: article,
    formArticle: state.controlMode === 'edit' ? article : null,
  })),

  on(ArticlesActions.getArticleImageFileSucceeded, (state, { imageFile }) => ({
    ...state,
    setArticle: state.setArticle ? { ...state.setArticle, imageFile } : null,
    formArticle: state.formArticle ? { ...state.formArticle, imageFile } : null,
  })),

  on(ArticlesActions.articleImageChangeReverted, state => ({
    ...state,
    formArticle: {
      ...state.formArticle!,
      imageFile: state.setArticle?.imageFile ?? null,
      imageUrl: state.setArticle?.imageUrl ?? null,
    },
  })),

  on(ArticlesActions.deleteArticleSelected, (state, { article }) => ({
    ...state,
    setArticle: article,
  })),

  on(ArticlesActions.deleteArticleSucceeded, (state, { article }) => ({
    ...state,
    articles: state.articles.filter(storedArticle => storedArticle.id !== article.id),
    setArticle: null,
    formArticle: null,
  })),

  on(ArticlesActions.formDataChanged, (state, { article }) => ({
    ...state,
    formArticle: article,
  })),
);

export function reducer(state: ArticlesState, action: Action): ArticlesState {
  return articlesReducer(state, action);
}
