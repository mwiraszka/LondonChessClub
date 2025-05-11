import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import type { Article, ArticleFormData, ControlMode, FileData, Id } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';

export interface ArticlesState extends EntityState<Article> {
  articleId: Id | null;
  bannerImageFileData: FileData | null;
  controlMode: ControlMode | null;
}

export const articlesAdapter = createEntityAdapter<Article>({
  sortComparer: (a, b) =>
    customSort(a, b, 'bookmarkDate', true, 'modificationInfo.dateCreated', true),
});

export const articlesInitialState: ArticlesState = articlesAdapter.getInitialState({
  articleId: null,
  bannerImageFileData: null,
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
          formData: {
            ...originalArticle.formData,
            image,
          },
        },
        {
          ...state,
          bannerImageFileData: null,
        },
      );
    },
  ),

  on(
    ArticlesActions.bannerImageSet,
    (state, { fileData }): ArticlesState => ({
      ...state,
      bannerImageFileData: fileData,
    }),
  ),

  on(
    ArticlesActions.bannerImageFileLoadFailed,
    (state): ArticlesState => ({
      ...state,
      bannerImageFileData: null,
    }),
  ),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.upsertOne<ArticlesState>(article, {
        ...state,
        articleFormData: null,
        bannerImageFileData: null,
      }),
  ),

  on(
    ArticlesActions.deleteArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.removeOne<ArticlesState>(article.id!, {
        ...state,
        articleId: null,
        articleFormData: null,
      }),
  ),

  on(
    ArticlesActions.formValueChanged,
    (state, { value }): ArticlesState => ({
      ...state,
      articleFormData: value as Required<ArticleFormData>,
    }),
  ),

  on(
    ArticlesActions.articleUnset,
    (state): ArticlesState => ({
      ...state,
      articleId: null,
      articleFormData: null,
      bannerImageFileData: null,
      controlMode: null,
    }),
  ),
);
