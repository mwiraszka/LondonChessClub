import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';

import type { Id } from '@app/models';
import { areSame } from '@app/utils';

import {
  ArticlesState,
  INITIAL_ARTICLE_FORM_DATA,
  articlesAdapter,
} from './articles.reducer';

const selectArticlesState = createFeatureSelector<ArticlesState>('articlesState');

const { selectAll: selectAllArticleEntities } =
  articlesAdapter.getSelectors(selectArticlesState);

export const selectAllArticles = createSelector(
  selectAllArticleEntities,
  allArticleEntities => allArticleEntities.map(entity => entity?.article),
);

export const selectArticleById = (id: Id | null) =>
  createSelector(
    selectAllArticleEntities,
    allArticleEntities =>
      allArticleEntities.find(entity => entity.article.id === id)?.article ?? null,
  );

export const selectArticleFormDataById = (id: Id | null) =>
  createSelector(
    selectArticlesState,
    selectAllArticleEntities,
    (state, allArticleEntities) =>
      allArticleEntities.find(entity => entity.article.id === id)?.formData ??
      state.newArticleFormData,
  );

export const selectHasUnsavedChanges = (id: Id | null) =>
  createSelector(
    selectArticleById(id),
    selectArticleFormDataById(id),
    (article, articleFormData) => {
      const formPropertiesOfOriginalArticle = pick(
        article ?? INITIAL_ARTICLE_FORM_DATA,
        Object.getOwnPropertyNames(articleFormData),
      );

      return !areSame(formPropertiesOfOriginalArticle, articleFormData);
    },
  );
