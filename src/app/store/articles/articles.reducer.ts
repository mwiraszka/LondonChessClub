import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import type { ArticleFormData, ControlMode, EditableArticle, Id } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';

export interface ArticlesState extends EntityState<EditableArticle> {
  articleId: Id | null;
  controlMode: ControlMode | null;
  newArticleFormData: ArticleFormData | null;
}

export const articlesAdapter = createEntityAdapter<EditableArticle>({
  sortComparer: (a, b) =>
    customSort(a, b, 'bookmarkDate', true, 'modificationInfo.dateCreated', true),
});

export const articlesInitialState: ArticlesState = articlesAdapter.getInitialState({
  articleId: null,
  controlMode: null,
  newArticleFormData: null,
});

export const articlesReducer = createReducer(
  articlesInitialState,

  on(
    ArticlesActions.fetchArticlesSucceeded,
    (state, { articles }): ArticlesState =>
      articlesAdapter.setAll(
        articles.map(article => ({
          ...article,
          formData: null,
        })),
        state,
      ),
  ),

  on(
    ArticlesActions.fetchArticleRequested,
    (state, { controlMode }): ArticlesState => ({
      ...state,
      controlMode,
    }),
  ),

  on(
    ArticlesActions.newArticleRequested,
    (state): ArticlesState => ({
      ...state,
      controlMode: 'add',
    }),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }): ArticlesState => {
    const originalArticle = state.entities[article.id];

    return articlesAdapter.upsertOne<ArticlesState>(
      {
        ...article,
        formData: originalArticle?.formData ?? null,
      },
      {
        ...state,
        articleId: article.id,
      },
    );
  }),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { image, setAsOriginal }): ArticlesState => {
      if (!state.articleId) {
        return state;
      }

      const originalArticle = state.entities[state.articleId];

      if (!originalArticle?.formData) {
        return state;
      }

      return articlesAdapter.upsertOne<ArticlesState>(
        {
          ...originalArticle,
          bannerImageId: setAsOriginal ? image.id : originalArticle.bannerImageId,
          formData: {
            ...originalArticle.formData,
            bannerImageId: image.id,
          },
        },
        state,
      );
    },
  ),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.upsertOne<ArticlesState>(
        {
          ...article,
          formData: null,
        },
        state,
      ),
  ),

  on(
    ArticlesActions.deleteArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.removeOne<ArticlesState>(article.id!, state),
  ),

  on(ArticlesActions.formValueChanged, (state, { value }): ArticlesState => {
    if (!state.articleId) {
      return state;
    }

    const originalArticle = state.entities[state.articleId];

    if (!originalArticle?.formData) {
      return state;
    }

    return articlesAdapter.upsertOne(
      {
        ...originalArticle,
        formData: {
          ...originalArticle.formData,
          ...value,
        },
      },
      state,
    );
  }),

  on(
    ArticlesActions.articleUnset,
    (state): ArticlesState => ({
      ...state,
      articleId: null,
      newArticleFormData: null,
      controlMode: null,
    }),
  ),
);
