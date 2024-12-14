import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Id, StoreFeatures } from '@app/types';
import { areSame } from '@app/utils';

import { ArticlesState } from './articles.state';

export const articlesFeatureSelector = createFeatureSelector<ArticlesState>(
  StoreFeatures.ARTICLES,
);

export const articles = createSelector(articlesFeatureSelector, state => state.articles);

export const articleById = (id: Id) =>
  createSelector(articles, allArticles => {
    return allArticles ? allArticles.find(article => article.id === id) : null;
  });

export const setArticle = createSelector(
  articlesFeatureSelector,
  state => state.setArticle,
);

export const setArticleTitle = createSelector(setArticle, article => article?.title);

export const formArticle = createSelector(
  articlesFeatureSelector,
  state => state.formArticle,
);

export const controlMode = createSelector(
  articlesFeatureSelector,
  state => state.controlMode,
);

export const hasUnsavedChanges = createSelector(
  formArticle,
  setArticle,
  (formArticle, setArticle) => {
    const { imageUrl: _1, thumbnailImageUrl: _2, ..._formArticle } = formArticle || {};
    const { imageUrl: _3, thumbnailImageUrl: _4, ..._setArticle } = setArticle || {};
    return !areSame(_formArticle, _setArticle);
  },
);
