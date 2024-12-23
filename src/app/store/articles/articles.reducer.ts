import { Action, createReducer, on } from '@ngrx/store';

import { ArticleFormData } from '@app/types';
import { newArticleFormTemplate } from '@app/types';
import { sortArticles } from '@app/utils';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

const articlesReducer = createReducer(
  initialState,

  on(
    ArticlesActions.fetchArticlesSucceeded,
    (state, { articles }): ArticlesState => ({
      ...state,
      articles,
    }),
  ),

  on(
    ArticlesActions.fetchArticleRequested,
    (state, { controlMode }): ArticlesState => ({
      ...state,
      controlMode,
    }),
  ),

  on(
    ArticlesActions.newArticleFormTemplateLoaded,
    (state): ArticlesState => ({
      ...state,
      articleFormData: newArticleFormTemplate,
    }),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }): ArticlesState => {
    return {
      ...state,
      articles: sortArticles([
        ...state.articles.map(storedArticle =>
          storedArticle.id === article.id ? article : storedArticle,
        ),
      ]),
      article,
      articleFormData: {
        imageId: article.imageId,
        title: article.title,
        body: article.body,
        isSticky: article.isSticky,
      } as ArticleFormData,
    };
  }),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }): ArticlesState => ({
      ...state,
      articles: sortArticles([
        ...state.articles.map(storedArticle =>
          storedArticle.id === article.id ? article : storedArticle,
        ),
      ]),
      article: null,
      articleFormData: null,
    }),
  ),

  on(
    ArticlesActions.deleteArticleSelected,
    (state, { article }): ArticlesState => ({
      ...state,
      article,
    }),
  ),

  on(
    ArticlesActions.deleteArticleSucceeded,
    (state, { article }): ArticlesState => ({
      ...state,
      articles: state.articles.filter(storedArticle => storedArticle.id !== article.id),
      article: null,
      articleFormData: null,
    }),
  ),

  on(
    ArticlesActions.formValueChanged,
    (state, { value }): ArticlesState => ({
      ...state,
      articleFormData: value as Required<ArticleFormData>,
    }),
  ),

  on(
    ArticlesActions.newImageStored,
    (state): ArticlesState => ({
      ...state,
      isNewImageStored: true,
    }),
  ),

  on(
    ArticlesActions.storedImageRemoved,
    (state): ArticlesState => ({
      ...state,
      isNewImageStored: false,
    }),
  ),

  on(
    ArticlesActions.articleUnset,
    (state): ArticlesState => ({
      ...state,
      article: null,
      articleFormData: null,
      controlMode: null,
    }),
  ),
);

export function reducer(state: ArticlesState, action: Action): ArticlesState {
  return articlesReducer(state, action);
}
