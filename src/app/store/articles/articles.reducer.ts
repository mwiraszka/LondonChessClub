import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import type { Article, ArticleFormData, ControlMode, Id } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';

export interface ArticlesState extends EntityState<Article> {
  articleId: Id | null;
  articleFormData: ArticleFormData | null;
  controlMode: ControlMode | null;
}

export const articlesAdapter = createEntityAdapter<Article>({
  sortComparer: (a, b) =>
    customSort(a, b, 'bookmarkDate', true, 'modificationInfo.dateCreated', true),
});

export const articlesInitialState: ArticlesState = articlesAdapter.getInitialState({
  articleId: null,
  articleFormData: null,
  controlMode: null,
});

export const articlesReducer = createReducer(
  articlesInitialState,

  on(
    ArticlesActions.fetchArticlesSucceeded,
    (state, { articles }): ArticlesState => articlesAdapter.addMany(articles, state),
  ),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { image }): ArticlesState => {
      const entityEntry = Object.entries(state.entities).find(
        entity => entity[1]!.imageId === image.id,
      );
      if (!entityEntry) {
        return state;
      }
      const articleId = entityEntry[0];

      return articlesAdapter.mapOne(
        {
          id: articleId,
          map: article => ({ ...article, imageUrl: image.presignedUrl }),
        },
        state,
      );
    },
  ),

  on(
    ImagesActions.fetchArticleBannerImageThumbnailsSucceeded,
    (state, { images }): ArticlesState =>
      articlesAdapter.map(article => {
        const articleBannerImage = images.find(
          image => image.id === `${article.imageId}-600x400`,
        );
        return articleBannerImage
          ? { ...article, thumbnailImageUrl: articleBannerImage.presignedUrl }
          : article;
      }, state),
  ),

  on(
    ArticlesActions.newArticleRequested,
    (state): ArticlesState => ({
      ...state,
      controlMode: 'add',
    }),
  ),

  on(
    ArticlesActions.fetchArticleRequested,
    (state, { controlMode }): ArticlesState => ({
      ...state,
      controlMode,
    }),
  ),

  on(
    ArticlesActions.fetchArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.upsertOne(article, { ...state, articleId: article.id }),
  ),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.upsertOne(article, {
        ...state,
        articleId: null,
        articleFormData: null,
      }),
  ),

  on(
    ArticlesActions.deleteArticleSucceeded,
    (state, { article }): ArticlesState =>
      articlesAdapter.removeOne(article.id!, {
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
      controlMode: null,
    }),
  ),
);
