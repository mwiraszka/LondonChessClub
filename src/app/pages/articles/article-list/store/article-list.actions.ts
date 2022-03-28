import { createAction, props } from '@ngrx/store';

import { Article } from '../../types/article.model';

enum ArticleListActionTypes {
  LOAD_ARTICLES_STARTED = '[Article List] Load articles started',
  LOAD_ARTICLES_SUCCEEDED = '[Article List] Load articles succeeded',
  LOAD_ARTICLES_FAILED = '[Article List] Load articles failed',

  COMPOSE_ARTICLE_SELECTED = '[Article List] Compose article selected',
  EDIT_ARTICLE_SELECTED = '[Article List] Edit article selected',

  DELETE_ARTICLE_SELECTED = '[Article List] Delete article selected',
  DELETE_ARTICLE_CONFIRMED = '[Article List] Delete article confirmed',
  DELETE_ARTICLE_CANCELLED = '[Article List] Delete article cancelled',
  DELETE_ARTICLE_SUCCEEDED = '[Article List] Delete article succeeded',
  DELETE_ARTICLE_FAILED = '[Article List] Delete article failed',
}

export const loadArticlesStarted = createAction(
  ArticleListActionTypes.LOAD_ARTICLES_STARTED
);
export const loadArticlesSucceeded = createAction(
  ArticleListActionTypes.LOAD_ARTICLES_SUCCEEDED,
  props<{ allArticles: Article[] }>()
);
export const loadArticlesFailed = createAction(
  ArticleListActionTypes.LOAD_ARTICLES_FAILED,
  props<{ errorMessage: string }>()
);

export const createArticleSelected = createAction(
  ArticleListActionTypes.COMPOSE_ARTICLE_SELECTED
);
export const editArticleSelected = createAction(
  ArticleListActionTypes.EDIT_ARTICLE_SELECTED,
  props<{ articleToEdit: Article }>()
);

export const deleteArticleSelected = createAction(
  ArticleListActionTypes.DELETE_ARTICLE_SELECTED,
  props<{ articleToDelete: Article }>()
);
export const deleteArticleConfirmed = createAction(
  ArticleListActionTypes.DELETE_ARTICLE_CONFIRMED
);
export const deleteArticleCancelled = createAction(
  ArticleListActionTypes.DELETE_ARTICLE_CANCELLED
);
export const deleteArticleSucceeded = createAction(
  ArticleListActionTypes.DELETE_ARTICLE_SUCCEEDED,
  props<{ deletedArticle: Article }>()
);
export const deleteArticleFailed = createAction(
  ArticleListActionTypes.DELETE_ARTICLE_FAILED,
  props<{ errorMessage: string }>()
);
