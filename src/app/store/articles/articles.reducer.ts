import { createReducer, on } from '@ngrx/store';
import { unionWith } from 'lodash';

import type { ArticleFormData } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { sortArticles } from '@app/utils';

import * as ArticlesActions from './articles.actions';
import { ArticlesState, initialState } from './articles.state';

export const articlesReducer = createReducer(
  initialState,

  on(
    ArticlesActions.fetchArticlesSucceeded,
    (state, { articles }): ArticlesState => ({
      ...state,
      articles: sortArticles(articles),
    }),
  ),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { image }): ArticlesState => ({
      ...state,
      articles: state.articles.map(article =>
        article.imageId === image.id
          ? { ...article, imageUrl: image.presignedUrl }
          : article,
      ),
      article:
        state.article?.imageId === image.id
          ? { ...state.article, imageUrl: image.presignedUrl }
          : state.article,
    }),
  ),

  on(
    ImagesActions.fetchArticleBannerImageThumbnailsSucceeded,
    (state, { images }): ArticlesState => ({
      ...state,
      articles: state.articles.map(article => {
        const articleBannerImage = images.find(
          image => image.id === `${article.imageId}-600x400`,
        );
        return articleBannerImage
          ? { ...article, thumbnailImageUrl: articleBannerImage.presignedUrl }
          : article;
      }),
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
    ArticlesActions.fetchArticleRequested,
    (state, { controlMode }): ArticlesState => ({
      ...state,
      controlMode,
    }),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }): ArticlesState => {
    return {
      ...state,
      articles: sortArticles(
        unionWith(state.articles, [article], (a, b) => a.id === b.id),
      ),
      article,
    };
  }),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleSucceeded,
    (state, { article }): ArticlesState => ({
      ...state,
      articles: sortArticles(
        unionWith(state.articles, [article], (a, b) => a.id === b.id),
      ),
      article: null,
      articleFormData: null,
    }),
  ),

  on(
    ArticlesActions.deleteArticleSucceeded,
    (state, { article }): ArticlesState => ({
      ...state,
      articles: state.articles.filter(storedArticle => storedArticle.id !== article.id),
      article: null,
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
      article: null,
      articleFormData: null,
      controlMode: null,
    }),
  ),
);
