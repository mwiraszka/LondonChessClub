import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';

import type { ArticleFormData, Id } from '@app/models';
import { AuthSelectors } from '@app/store/auth';
import { areSame } from '@app/utils';

import { ImagesSelectors } from '../images';
import { ArticlesState, articlesAdapter } from './articles.reducer';

const selectArticlesState = createFeatureSelector<ArticlesState>('articlesState');

const { selectAll: selectAllArticles } =
  articlesAdapter.getSelectors(selectArticlesState);

export const selectArticleById = (id: Id) =>
  createSelector(selectAllArticles, allArticles =>
    allArticles ? allArticles.find(article => article.id === id) : null,
  );

export const selectNewArticleFormData = createSelector(
  selectArticlesState,
  state => state.newArticleFormData,
);

export const selectHasUnsavedChanges = (id: Id) =>
  createSelector(selectArticleById(id), article => {
    if (!article || !article.formData) {
      return null;
    }

    const formPropertiesOfOriginalArticle = pick(
      article,
      Object.getOwnPropertyNames(article.formData),
    ) as ArticleFormData;

    return !areSame(formPropertiesOfOriginalArticle, article.formData);
  });

export const selectArticleViewerPageViewModel = (id: Id) =>
  createSelector({
    article: selectArticleById(id),
    isAdmin: AuthSelectors.selectIsAdmin,
  });

export const selectArticleEditorPageViewModel = (id: Id) =>
  createSelector({
    article: selectArticleById(id),
    hasUnsavedChanges: selectHasUnsavedChanges,
  });

export const selectArticleGridViewModel = createSelector({
  articles: selectAllArticles,
  thumbnailImages: ImagesSelectors.selectThumbnailImages,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectArticleFormViewModel = (id: Id) =>
  createSelector({
    article: selectArticleById(id),
    hasUnsavedChanges: selectHasUnsavedChanges,
  });
