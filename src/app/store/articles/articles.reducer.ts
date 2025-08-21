import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import { ARTICLE_FORM_DATA_PROPERTIES, INITIAL_ARTICLE_FORM_DATA } from '@app/constants';
import { Article, ArticleFormData, DataPaginationOptions, IsoDate } from '@app/models';

import * as ArticlesActions from './articles.actions';

export interface ArticlesState
  extends EntityState<{ article: Article; formData: ArticleFormData }> {
  newArticleFormData: ArticleFormData;
  lastHomePageFetch: IsoDate | null;
  lastNewsPageFetch: IsoDate | null;
  options: DataPaginationOptions<Article>;
  filteredCount: number | null;
  totalCount: number;
  homePageArticles: Article[];
}

export const articlesAdapter = createEntityAdapter<{
  article: Article;
  formData: ArticleFormData;
}>({
  selectId: ({ article }) => article.id,
});

export const initialState: ArticlesState = articlesAdapter.getInitialState({
  newArticleFormData: INITIAL_ARTICLE_FORM_DATA,
  lastHomePageFetch: null,
  lastNewsPageFetch: null,
  options: {
    page: 1,
    pageSize: 10,
    sortBy: 'bookmarkDate',
    sortOrder: 'desc',
    filters: {},
    search: '',
  },
  filteredCount: null,
  totalCount: 0,
  homePageArticles: [],
});

export const articlesReducer = createReducer(
  initialState,

  on(
    ArticlesActions.fetchHomePageArticlesSucceeded,
    (state, { articles }): ArticlesState => ({
      ...state,
      homePageArticles: articles,
      lastHomePageFetch: new Date().toISOString(),
    }),
  ),

  on(
    ArticlesActions.fetchNewsPageArticlesSucceeded,
    (state, { articles, filteredCount, totalCount }): ArticlesState =>
      articlesAdapter.setAll(
        articles.map(article => ({
          article,
          formData: pick(article, ARTICLE_FORM_DATA_PROPERTIES),
        })),
        {
          ...state,
          lastNewsPageFetch: new Date().toISOString(),
          filteredCount,
          totalCount,
        },
      ),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }): ArticlesState => {
    const previousFormData = state.entities[article.id]?.formData;
    return articlesAdapter.upsertOne(
      {
        article,
        formData: previousFormData ?? pick(article, ARTICLE_FORM_DATA_PROPERTIES),
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

  on(
    ArticlesActions.paginationOptionsChanged,
    (state, { options }): ArticlesState => ({
      ...state,
      options,
    }),
  ),

  on(ArticlesActions.articleFormDataReset, (state, { articleId }): ArticlesState => {
    const originalArticle = articleId ? state.entities[articleId]?.article : null;

    if (!originalArticle) {
      return {
        ...state,
        newArticleFormData: INITIAL_ARTICLE_FORM_DATA,
      };
    }

    return articlesAdapter.upsertOne(
      {
        article: originalArticle,
        formData: pick(originalArticle, ARTICLE_FORM_DATA_PROPERTIES),
      },
      state,
    );
  }),
);
