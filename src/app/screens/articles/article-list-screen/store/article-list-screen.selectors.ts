import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types';

import { ArticleListScreenState } from './article-list-screen.state';

export const articleListScreenFeatureSelector =
  createFeatureSelector<ArticleListScreenState>(AppStoreFeatureTypes.ARTICLE_LIST_SCREEN);

export const articles = createSelector(
  articleListScreenFeatureSelector,
  (state) => state.articles
);

export const selectedArticle = createSelector(
  articleListScreenFeatureSelector,
  (state) => state.selectedArticle
);

export const isLoading = createSelector(
  articleListScreenFeatureSelector,
  (state) => state.isLoading
);
