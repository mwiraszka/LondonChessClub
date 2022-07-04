import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleGridState } from './article-grid.state';

export const articleGridFeatureSelector = createFeatureSelector<ArticleGridState>(
  AppStoreFeatureTypes.ARTICLE_GRID
);

export const articles = createSelector(
  articleGridFeatureSelector,
  (state) => state.articles
);

export const selectedArticle = createSelector(
  articleGridFeatureSelector,
  (state) => state.selectedArticle
);

export const isLoading = createSelector(
  articleGridFeatureSelector,
  (state) => state.isLoading
);
