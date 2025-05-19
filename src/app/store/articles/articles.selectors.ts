import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';

import type { Id } from '@app/models';
import { AuthSelectors } from '@app/store/auth';
import { areSame } from '@app/utils';

import { ImagesSelectors } from '../images';
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
  allArticleEntities => allArticleEntities.map(entity => entity.article),
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

export const selectArticleViewerPageViewModel = (id: Id) =>
  createSelector({
    article: selectArticleById(id),
    isAdmin: AuthSelectors.selectIsAdmin,
  });

export const selectArticleEditorPageViewModel = (id: Id | null) =>
  createSelector({
    bannerImage: ImagesSelectors.selectImageById(id ?? ''), // temp - fixme!
    formData: selectArticleFormDataById(id),
    hasUnsavedChanges: selectHasUnsavedChanges(id),
    originalArticle: selectArticleById(id),
  });

export const selectArticleGridViewModel = createSelector({
  articles: selectAllArticles,
  thumbnailImages: ImagesSelectors.selectThumbnailImages,
  isAdmin: AuthSelectors.selectIsAdmin,
});
