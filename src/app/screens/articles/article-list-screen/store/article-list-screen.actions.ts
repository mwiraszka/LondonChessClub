import { createAction, props } from '@ngrx/store';

import { Article } from '../../types/article.model';

enum ArticleListScreenActionTypes {
  LOAD_ARTICLES_STARTED = '[Article List Screen] Load articles started',
  LOAD_ARTICLES_SUCCEEDED = '[Article List Screen] Load articles succeeded',
  LOAD_ARTICLES_FAILED = '[Article List Screen] Load articles failed',

  COMPOSE_ARTICLE_SELECTED = '[Article List Screen] Compose article selected',
  EDIT_ARTICLE_SELECTED = '[Article List Screen] Edit article selected',

  DELETE_ARTICLE_SELECTED = '[Article List Screen] Delete article selected',
  DELETE_ARTICLE_CONFIRMED = '[Article List Screen] Delete article confirmed',
  DELETE_ARTICLE_CANCELLED = '[Article List Screen] Delete article cancelled',
  DELETE_ARTICLE_SUCCEEDED = '[Article List Screen] Delete article succeeded',
  DELETE_ARTICLE_FAILED = '[Article List Screen] Delete article failed',
}

export const loadArticlesStarted = createAction(
  ArticleListScreenActionTypes.LOAD_ARTICLES_STARTED
);
export const loadArticlesSucceeded = createAction(
  ArticleListScreenActionTypes.LOAD_ARTICLES_SUCCEEDED,
  props<{ allArticles: Article[] }>()
);
export const loadArticlesFailed = createAction(
  ArticleListScreenActionTypes.LOAD_ARTICLES_FAILED,
  props<{ error: Error }>()
);

export const createArticleSelected = createAction(
  ArticleListScreenActionTypes.COMPOSE_ARTICLE_SELECTED
);
export const editArticleSelected = createAction(
  ArticleListScreenActionTypes.EDIT_ARTICLE_SELECTED,
  props<{ articleToEdit: Article }>()
);

export const deleteArticleSelected = createAction(
  ArticleListScreenActionTypes.DELETE_ARTICLE_SELECTED,
  props<{ articleToDelete: Article }>()
);
export const deleteArticleConfirmed = createAction(
  ArticleListScreenActionTypes.DELETE_ARTICLE_CONFIRMED
);
export const deleteArticleCancelled = createAction(
  ArticleListScreenActionTypes.DELETE_ARTICLE_CANCELLED
);
export const deleteArticleSucceeded = createAction(
  ArticleListScreenActionTypes.DELETE_ARTICLE_SUCCEEDED,
  props<{ deletedArticle: Article }>()
);
export const deleteArticleFailed = createAction(
  ArticleListScreenActionTypes.DELETE_ARTICLE_FAILED,
  props<{ error: Error }>()
);
