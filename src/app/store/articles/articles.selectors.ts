import { createFeatureSelector, createSelector } from '@ngrx/store';

import { newArticleFormTemplate } from '@app/components/article-form/new-article-form-template';
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

export const selectArticleFormData = createSelector(
  selectArticlesState,
  state => state.articleFormData,
);

export const selectBannerImageUrl = createSelector(
  selectArticlesState,
  state => state.bannerImageUrl,
);

export const selectBannerImageFileData = createSelector(
  selectArticlesState,
  state => state.bannerImageFileData,
);

export const selectOriginalBannerImageUrl = createSelector(
  selectArticlesState,
  state => state.originalBannerImageUrl,
);

export const selectControlMode = createSelector(
  selectArticlesState,
  state => state.controlMode,
);

export const selectHasUnsavedChanges = createSelector(
  selectControlMode,
  selectArticle,
  selectArticleFormData,
  selectBannerImageFileData,
  (controlMode, article, articleFormData, bannerImageFileData) => {
    if (!articleFormData) {
      return null;
    }

    if (bannerImageFileData) {
      return true;
    }

    if (controlMode === 'add') {
      return !areSame(articleFormData, newArticleFormTemplate);
    }

    if (!article) {
      return null;
    }

    const relevantPropertiesOfArticle: ArticleFormData = {
      title: article.title,
      body: article.body,
      imageId: article.imageId,
      imageFilename: '',
    };

    return !areSame(relevantPropertiesOfArticle, articleFormData);
  },
);

export const selectArticleViewerPageViewModel = createSelector({
  article: selectArticle,
  bannerImageUrl: selectBannerImageUrl,
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
  articleFormData: selectArticleFormData,
  bannerImageUrl: selectBannerImageUrl,
  originalBannerImageUrl: selectOriginalBannerImageUrl,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});
