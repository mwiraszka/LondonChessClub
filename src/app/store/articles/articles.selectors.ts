import { createFeatureSelector, createSelector } from '@ngrx/store';

import { newArticleFormTemplate } from '@app/components/article-form/new-article-form-template';
import type { ArticleFormData, Id } from '@app/models';
import { AuthSelectors } from '@app/store/auth';
import { ImagesSelectors } from '@app/store/images';
import { areSame } from '@app/utils';

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

export const selectControlMode = createSelector(
  selectArticlesState,
  state => state.controlMode,
);

export const selectHasUnsavedChanges = createSelector(
  selectControlMode,
  selectArticle,
  selectArticleFormData,
  ImagesSelectors.selectIsNewImageStored,
  (controlMode, article, articleFormData, isNewImageStored) => {
    if (isNewImageStored) {
      return true;
    }

    if (!articleFormData) {
      return null;
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
    };

    return !areSame(relevantPropertiesOfArticle, articleFormData);
  },
);

export const selectArticleViewerScreenViewModel = createSelector({
  article: selectArticle,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectArticleEditorScreenViewModel = createSelector({
  article: selectArticle,
  articleTitle: selectArticleTitle,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});

export const selectArticleGridViewModel = createSelector({
  articles: selectAllArticles,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectArticleFormViewModel = createSelector({
  article: selectArticle,
  articleFormData: selectArticleFormData,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});
