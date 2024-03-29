import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';
import { areSame } from '@app/utils';

import { ArticlesState } from './articles.state';

export const articlesFeatureSelector = createFeatureSelector<ArticlesState>(
  AppStoreFeatureTypes.ARTICLES,
);

export const articles = createSelector(articlesFeatureSelector, state => state.articles);

export const articleById = (id: string) =>
  createSelector(articles, allArticles => {
    return allArticles ? allArticles.find(article => article.id === id) : null;
  });

export const selectedArticle = createSelector(
  articlesFeatureSelector,
  state => state.selectedArticle,
);

export const articleBeforeEdit = createSelector(
  articlesFeatureSelector,
  state => state.articleBeforeEdit,
);

export const articleCurrently = createSelector(
  articlesFeatureSelector,
  state => state.articleCurrently,
);

export const isEditMode = createSelector(
  articlesFeatureSelector,
  state => state.isEditMode,
);

export const sectionToScrollTo = createSelector(
  articlesFeatureSelector,
  state => state.sectionToScrollTo,
);

export const hasUnsavedChanges = createSelector(
  articlesFeatureSelector,
  state => !areSame(state.articleCurrently, state.articleBeforeEdit),
);
