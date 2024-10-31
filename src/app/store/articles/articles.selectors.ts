import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';
import { areSame } from '@app/utils';

import { ArticlesState } from './articles.state';

export const articlesFeatureSelector = createFeatureSelector<ArticlesState>(
  StoreFeatures.ARTICLES,
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

export const selectedArticleTitle = createSelector(
  selectedArticle,
  article => article?.title,
);

export const formArticle = createSelector(
  articlesFeatureSelector,
  state => state.formArticle,
);

export const articleImageCurrently = createSelector(formArticle, formArticle => {
  return {
    imageFile: formArticle?.imageFile ?? null,
    imageUrl: formArticle?.imageUrl ?? null,
  };
});

export const hasNewImage = createSelector(
  formArticle,
  selectedArticle,
  (formArticle, selectedArticle) => formArticle?.imageUrl !== selectedArticle?.imageUrl,
);

export const controlMode = createSelector(
  articlesFeatureSelector,
  state => state.controlMode,
);

export const hasUnsavedChanges = createSelector(
  formArticle,
  selectedArticle,
  (formArticle, selectedArticle) => !areSame(formArticle, selectedArticle),
);
