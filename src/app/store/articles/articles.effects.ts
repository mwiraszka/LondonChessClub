import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Article, DataPaginationOptions } from '@app/models';
import { ArticlesService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { ImagesActions } from '@app/store/images';
import { isDefined, parseError } from '@app/utils';

import { ArticlesActions, ArticlesSelectors } from '.';

@Injectable()
export class ArticlesEffects {
  fetchHomePageArticles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchHomePageArticlesRequested),
      switchMap(() => {
        const options: DataPaginationOptions<Article> = {
          page: 1,
          pageSize: 6,
          sortBy: 'bookmarkDate',
          sortOrder: 'desc',
          filters: {},
          search: '',
        };

        return this.articlesService.getFilteredArticles(options).pipe(
          map(response =>
            ArticlesActions.fetchHomePageArticlesSucceeded({
              articles: response.data.items,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(ArticlesActions.fetchHomePageArticlesFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  fetchHomePageArticleBannerImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchHomePageArticlesSucceeded),
      map(({ articles }) =>
        ImagesActions.fetchBatchThumbnailsRequested({
          imageIds: articles.map(article => article.bannerImageId),
        }),
      ),
    );
  });

  fetchFilteredArticles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchFilteredArticlesRequested),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.selectOptions)),
      switchMap(([, options]) =>
        this.articlesService.getFilteredArticles(options).pipe(
          map(response =>
            ArticlesActions.fetchFilteredArticlesSucceeded({
              articles: response.data.items,
              filteredCount: response.data.filteredCount,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(ArticlesActions.fetchFilteredArticlesFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  fetchFilteredArticleBannerImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchFilteredArticlesSucceeded),
      filter(({ articles }) => articles.length > 0),
      map(({ articles }) =>
        ImagesActions.fetchBatchThumbnailsRequested({
          imageIds: articles.map(article => article.bannerImageId),
        }),
      ),
    );
  });

  refetchFilteredArticlesAfterPaginationOptionsChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.paginationOptionsChanged),
      filter(({ fetch }) => fetch),
      map(() => ArticlesActions.fetchFilteredArticlesRequested()),
    );
  });

  fetchArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleRequested),
      switchMap(({ articleId }) =>
        this.articlesService.getArticle(articleId).pipe(
          map(response =>
            ArticlesActions.fetchArticleSucceeded({ article: response.data }),
          ),
          catchError(error =>
            of(ArticlesActions.fetchArticleFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleRequested),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.selectArticleFormDataById(null)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, formData, user]) => {
        const article: Article = {
          ...formData,
          id: '',
          bookmarkDate: null,
          modificationInfo: {
            createdBy: `${user.firstName} ${user.lastName}`,
            dateCreated: moment().toISOString(),
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.articlesService.addArticle(article).pipe(
          map(response =>
            ArticlesActions.publishArticleSucceeded({
              article: { ...article, id: response.data },
            }),
          ),
          catchError(error =>
            of(ArticlesActions.publishArticleFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleRequested),
      concatLatestFrom(({ articleId }) => [
        this.store
          .select(ArticlesSelectors.selectArticleById(articleId))
          .pipe(filter(isDefined)),
        this.store.select(ArticlesSelectors.selectArticleFormDataById(articleId)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, article, formData, user]) => {
        const updatedArticle: Article = {
          ...article,
          ...formData,
          modificationInfo: {
            ...article.modificationInfo,
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.articlesService.updateArticle(updatedArticle).pipe(
          filter(response => response.data === updatedArticle.id),
          map(() =>
            ArticlesActions.updateArticleSucceeded({
              article: updatedArticle,
              originalArticleTitle: article.title,
            }),
          ),
          catchError(error =>
            of(ArticlesActions.updateArticleFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  updateArticleBookmarkRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleBookmarkRequested),
      concatLatestFrom(({ articleId }) =>
        this.store
          .select(ArticlesSelectors.selectArticleById(articleId))
          .pipe(filter(isDefined)),
      ),
      switchMap(([{ bookmark }, article]) => {
        const updatedArticle: Article = {
          ...article,
          bookmarkDate: bookmark ? moment().toISOString() : null,
        };
        return this.articlesService.updateArticle(updatedArticle).pipe(
          map(() =>
            ArticlesActions.updateArticleSucceeded({
              article: updatedArticle,
              originalArticleTitle: article.title,
            }),
          ),
          catchError(error =>
            of(ArticlesActions.updateArticleFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleRequested),
      switchMap(({ article }) =>
        this.articlesService.deleteArticle(article.id).pipe(
          filter(response => response.data === article.id),
          map(() =>
            ArticlesActions.deleteArticleSucceeded({
              articleId: article.id,
              articleTitle: article.title,
            }),
          ),
          catchError(error =>
            of(ArticlesActions.deleteArticleFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly articlesService: ArticlesService,
    private readonly store: Store,
  ) {}
}
