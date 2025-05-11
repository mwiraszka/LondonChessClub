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

export const selectArticleId = createSelector(
  selectArticlesState,
  state => state.articleId,
);

export const selectArticle = createSelector(
  selectAllArticles,
  selectArticleId,
  (allArticles, articleId) =>
    articleId ? allArticles.find(article => article.id === articleId) : null,
);

export const selectArticleTitle = createSelector(
  selectArticle,
  article => article?.title,
);

export const selectBannerImageFileData = createSelector(
  selectArticlesState,
  state => state.bannerImageFileData,
);

export const selectControlMode = createSelector(
  selectArticlesState,
  state => state.controlMode,
);

export const selectHasUnsavedChanges = createSelector(selectArticle, article => {
  if (!article) {
    return null;
  }

  const formPropertiesOfOriginalArticle = pick(
    article,
    Object.getOwnPropertyNames(article.formData),
  ) as ArticleFormData;

  return !areSame(formPropertiesOfOriginalArticle, article.formData);
});

export const selectArticleViewerPageViewModel = createSelector({
  article: selectArticle,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectArticleEditorPageViewModel = createSelector({
  articleTitle: selectArticleTitle,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});

export const selectArticleGridViewModel = createSelector({
  articles: selectAllArticles,
  thumbnailImages: ImagesSelectors.selectThumbnailImages,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectArticleFormViewModel = createSelector({
  article: selectArticle,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});
