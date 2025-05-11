import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import type { Article, ControlMode, Id } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';

export interface ArticlesState extends EntityState<Article> {
  articleId: Id | null;
  controlMode: ControlMode | null;
}

export const articlesAdapter = createEntityAdapter<Article>({
  sortComparer: (a, b) =>
    customSort(a, b, 'bookmarkDate', true, 'modificationInfo.dateCreated', true),
});

export const articlesInitialState: ArticlesState = articlesAdapter.getInitialState({
  articleId: null,
  controlMode: null,
});

export const articlesReducer = createReducer(
  articlesInitialState,

  on(
    ArticlesActions.fetchArticlesSucceeded,
    (state, { articles }): ArticlesState => articlesAdapter.setAll(articles, state),
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

  on(
    ArticlesActions.fetchArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.upsertOne<ArticlesState>(article, {
        ...state,
        articleId: article.id,
      }),
  ),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { image, setAsOriginal }): ArticlesState => {
      const originalArticle = state.entities[state.articleId!]!;

      return articlesAdapter.upsertOne<ArticlesState>(
        {
          ...originalArticle,
          image: setAsOriginal ? image : originalArticle.image,
          formData: originalArticle.formData
            ? {
                ...originalArticle.formData,
                image,
              }
            : null,
        },
        state,
      );
    },
  ),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.upsertOne<ArticlesState>(article, state),
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

    const originalArticle = state.entities[state.articleId]!;

    return articlesAdapter.upsertOne(
      {
        ...originalArticle,
        formData: originalArticle.formData
          ? {
              ...originalArticle.formData,
              ...value,
            }
          : originalArticle.formData,
      },
      state,
    );
  }),

  on(
    ArticlesActions.articleUnset,
    (state): ArticlesState => ({
      ...state,
      articleId: null,
    }),
  ),
);
