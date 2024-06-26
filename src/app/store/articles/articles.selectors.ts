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

export const selectedArticleTitle = createSelector(
  selectedArticle,
  article => article?.title,
);

export const articleCurrently = createSelector(
  articlesFeatureSelector,
  state => state.articleCurrently,
);

export const articleImageCurrently = createSelector(
  articleCurrently,
  articleCurrently => {
    return {
      imageFile: articleCurrently?.imageFile ?? null,
      imageUrl: articleCurrently?.imageUrl ?? null,
    };
  },
);

export const hasNewImage = createSelector(
  articleCurrently,
  selectedArticle,
  (articleCurrently, selectedArticle) =>
    articleCurrently?.imageUrl !== selectedArticle?.imageUrl,
);

export const isEditMode = createSelector(
  articlesFeatureSelector,
  state => state.isEditMode,
);

export const hasUnsavedChanges = createSelector(
  articleCurrently,
  selectedArticle,
  (articleCurrently, selectedArticle) => !areSame(articleCurrently, selectedArticle),
);
