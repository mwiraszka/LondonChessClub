import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import {
  ARTICLE_FORM_DATA_PROPERTIES,
  type Article,
  type ArticleFormData,
} from '@app/models';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';

export const INITIAL_ARTICLE_FORM_DATA: ArticleFormData = {
  title: '',
  body: '',
  bannerImageId: null,
};

export interface ArticlesState
  extends EntityState<{ article: Article; formData: ArticleFormData }> {
  newArticleFormData: ArticleFormData;
}

export const articlesAdapter = createEntityAdapter<{
  article: Article;
  formData: ArticleFormData;
}>({
  selectId: ({ article }) => article.id,
  sortComparer: (a, b) =>
    customSort(
      a,
      b,
      'article.bookmarkDate',
      true,
      'article.modificationInfo.dateCreated',
      true,
    ),
});

export const initialState: ArticlesState = articlesAdapter.getInitialState({
  newArticleFormData: INITIAL_ARTICLE_FORM_DATA,
});

export const articlesReducer = createReducer(
  initialState,

  on(
    ArticlesActions.fetchArticlesSucceeded,
    (state, { articles }): ArticlesState =>
      articlesAdapter.setAll(
        articles.map(article => ({
          article,
          formData: pick(article, ARTICLE_FORM_DATA_PROPERTIES),
        })),
        state,
      ),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }): ArticlesState => {
    return articlesAdapter.upsertOne(
      {
        article,
        formData: pick(article, ARTICLE_FORM_DATA_PROPERTIES),
      },
      state,
    );
  }),

  on(
    ArticlesActions.publishArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.upsertOne(
        {
          article,
          formData: pick(article, ARTICLE_FORM_DATA_PROPERTIES),
        },
        { ...state, newArticleFormData: INITIAL_ARTICLE_FORM_DATA },
      ),
  ),

  on(ArticlesActions.updateArticleSucceeded, (state, { article }) =>
    articlesAdapter.upsertOne(
      {
        article,
        formData: pick(article, ARTICLE_FORM_DATA_PROPERTIES),
      },
      state,
    ),
  ),

  on(
    ArticlesActions.deleteArticleSucceeded,
    (state, { articleId }): ArticlesState => articlesAdapter.removeOne(articleId, state),
  ),

  on(ArticlesActions.formValueChanged, (state, { articleId, value }): ArticlesState => {
    const originalArticle = articleId ? state.entities[articleId] : null;

    if (!originalArticle) {
      return {
        ...state,
        newArticleFormData: {
          ...state.newArticleFormData,
          ...value,
        },
      };
    }

    return articlesAdapter.upsertOne(
      {
        ...originalArticle,
        formData: {
          ...(originalArticle?.formData ?? INITIAL_ARTICLE_FORM_DATA),
          ...value,
        },
      },
      state,
    );
  }),

  on(ArticlesActions.articleFormDataCleared, (state, { articleId }): ArticlesState => {
    const originalArticle = articleId ? state.entities[articleId] : null;

    if (!originalArticle) {
      return {
        ...state,
        newArticleFormData: INITIAL_ARTICLE_FORM_DATA,
      };
    }

    return articlesAdapter.upsertOne(
      {
        ...originalArticle,
        formData: INITIAL_ARTICLE_FORM_DATA,
      },
      state,
    );
  }),
);
