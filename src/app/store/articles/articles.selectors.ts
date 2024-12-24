import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthSelectors } from '@app/store/auth';
import { ArticleFormData, Id, newArticleFormTemplate } from '@app/types';
import { areSame } from '@app/utils';

import { ArticlesState } from './articles.state';

export const selectArticlesState = createFeatureSelector<ArticlesState>('articles');

export const selectArticles = createSelector(
  selectArticlesState,
  state => state.articles,
);

export const selectArticleById = (id: Id) =>
  createSelector(selectArticles, articles =>
    articles ? articles.find(article => article.id === id) : null,
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

    const relevantPropertiesOfArticle: ArticleFormData = {
      title: article.title,
      body: article.body,
      imageId: article.imageId,
      isSticky: article.isSticky,
    };

    return !areSame(relevantPropertiesOfArticle, articleFormData);
  },
);

export const selectArticleViewerScreenViewModel = createSelector({
  article: selectArticle,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectArticleEditorScreenViewModel = createSelector({
  articleTitle: selectArticleTitle,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});

export const selectArticleGridViewModel = createSelector({
  articles: selectArticles,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectArticleFormViewModel = createSelector({
  article: selectArticle,
  articleFormData: selectArticleFormData,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});
