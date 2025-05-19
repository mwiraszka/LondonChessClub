import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import type { ArticleFormData, EditableArticle } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { customSort } from '@app/utils';

import * as ArticlesActions from './articles.actions';

const INITIAL_ARTICLE_FORM_DATA: ArticleFormData = {
  title: '',
  body: '',
  bannerImageId: null,
};

export interface ArticlesState extends EntityState<EditableArticle> {
  newArticleFormData: ArticleFormData;
}

export const articlesAdapter = createEntityAdapter<EditableArticle>({
  sortComparer: (a, b) =>
    customSort(a, b, 'bookmarkDate', true, 'modificationInfo.dateCreated', true),
});

export const initialState: ArticlesState = articlesAdapter.getInitialState({
  newArticleFormData: INITIAL_ARTICLE_FORM_DATA,
});

export const articlesReducer = createReducer(
  initialState,

  on(
    ArticlesActions.fetchArticlesSucceeded,
    (state, { articles }): ArticlesState =>
      articlesAdapter.setAll(
        articles.map(article => ({
          ...article,
          formData: {
            title: article.title,
            body: article.body,
            bannerImageId: article.bannerImageId,
          },
        })),
        state,
      ),
  ),

  on(ArticlesActions.fetchArticleSucceeded, (state, { article }): ArticlesState => {
    return articlesAdapter.upsertOne<ArticlesState>(
      {
        ...article,
        formData: {
          title: article.title,
          body: article.body,
          bannerImageId: article.bannerImageId,
        },
      },
      state,
    );
  }),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { articleId, image, setAsOriginal }): ArticlesState => {
      const originalArticle = state.entities[articleId];

      if (!originalArticle) {
        return state;
      }

      return articlesAdapter.upsertOne<ArticlesState>(
        {
          ...originalArticle,
          bannerImageId: setAsOriginal ? image.id : originalArticle.bannerImageId,
          formData: {
            ...(originalArticle.formData ?? INITIAL_ARTICLE_FORM_DATA),
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
          formData: {
            title: article.title,
            body: article.body,
            bannerImageId: article.bannerImageId,
          },
        },
        state,
      ),
  ),

  on(
    ArticlesActions.deleteArticleSucceeded,
    (state, { articleId }): ArticlesState =>
      articlesAdapter.removeOne<ArticlesState>(articleId, state),
  ),

  on(ArticlesActions.formValueChanged, (state, { articleId, value }): ArticlesState => {
    const originalArticle = articleId ? state.entities[articleId] : null;

    if (!originalArticle) {
      return {
        ...state,
        newArticleFormData: {
          ...state.newArticleFormData,
          ...value,
        },
      };
    }

    return articlesAdapter.upsertOne(
      {
        ...originalArticle,
        formData: {
          ...(originalArticle?.formData ?? INITIAL_ARTICLE_FORM_DATA),
          ...value,
        },
      },
      state,
    );
  }),

  on(ArticlesActions.articleFormDataCleared, (state, { articleId }): ArticlesState => {
    const originalArticle = articleId ? state.entities[articleId] : null;

    if (!originalArticle) {
      return {
        ...state,
        newArticleFormData: INITIAL_ARTICLE_FORM_DATA,
      };
    }

    return articlesAdapter.upsertOne(
      {
        ...originalArticle,
        formData: INITIAL_ARTICLE_FORM_DATA,
      },
      state,
    );
  }),
);
