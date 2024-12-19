import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ArticleFormData, Id, StoreFeatures, newArticleFormTemplate } from '@app/types';
import { areSame } from '@app/utils';

import { ArticlesState } from './articles.state';

export const selectArticlesState = createFeatureSelector<ArticlesState>(
  StoreFeatures.ARTICLES,
);

export const selectArticles = createSelector(
  selectArticlesState,
  state => state.articles,
);

export const selectArticleById = (id: Id) =>
  createSelector(selectArticles, allArticles =>
    allArticles ? allArticles.find(article => article.id === id) : null,
  );

export const selectArticle = createSelector(selectArticlesState, state => state.article);

export const selectArticleTitle = createSelector(
  selectArticle,
  article => article?.title,
);

export const selectArticleFormData = createSelector(
  selectArticlesState,
  state => state.articleFormData,
);

export const selectIsNewImageStored = createSelector(
  selectArticlesState,
  state => state.isNewImageStored,
);

export const selectControlMode = createSelector(
  selectArticlesState,
  state => state.controlMode,
);

export const selectHasUnsavedChanges = createSelector(
  selectControlMode,
  selectArticle,
  selectArticleFormData,
  selectIsNewImageStored,
  (controlMode, article, articleFormData, isNewImageStored) => {
    if (isNewImageStored) {
      return true;
    }

    if (controlMode === 'add') {
      return !areSame(articleFormData, newArticleFormTemplate);
    }

    if (!article || !articleFormData) {
      return null;
    }

    const relevantFieldsOfArticle: ArticleFormData = {
      title: article.title,
      body: article.body,
      imageId: article.imageId,
      isSticky: article.isSticky,
    };

    return !areSame(relevantFieldsOfArticle, articleFormData);
  },
);

export const selectArticleFormViewModel = createSelector(
  selectArticle,
  selectArticleFormData,
  selectControlMode,
  selectHasUnsavedChanges,
  (article, articleFormData, controlMode, hasUnsavedChanges) => ({
    article,
    articleFormData,
    controlMode,
    hasUnsavedChanges,
  }),
);
