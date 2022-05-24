import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleListState } from './article-list.state';

export const articleListFeatureSelector = createFeatureSelector<ArticleListState>(
  AppStoreFeatureTypes.ARTICLE_LIST
);

export const articles = createSelector(
  articleListFeatureSelector,
  (state) => state.articles
);

export const selectedArticle = createSelector(
  articleListFeatureSelector,
  (state) => state.selectedArticle
);

export const isLoading = createSelector(
  articleListFeatureSelector,
  (state) => state.isLoading
);
