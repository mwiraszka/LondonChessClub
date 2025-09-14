import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { merge, of, timer } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Article, DataPaginationOptions } from '@app/models';
import { ArticlesApiService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { isDefined, isExpired, parseError } from '@app/utils';

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
          filters: null,
          search: '',
        };

        return this.articlesApiService.getFilteredArticles(options).pipe(
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

  fetchFilteredArticles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchFilteredArticlesRequested),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.selectOptions)),
      switchMap(([, options]) =>
        this.articlesApiService.getFilteredArticles(options).pipe(
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

  refetchHomePageArticles$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
        ArticlesActions.deleteArticleSucceeded,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 10 * 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(ArticlesSelectors.selectLastHomePageFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => ArticlesActions.fetchHomePageArticlesRequested()),
    );
  });

  refetchFilteredArticles$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
        ArticlesActions.deleteArticleSucceeded,
        ArticlesActions.paginationOptionsChanged,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 10 * 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(ArticlesSelectors.selectLastFilteredFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => ArticlesActions.fetchFilteredArticlesRequested()),
    );
  });

  fetchArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleRequested),
      switchMap(({ articleId }) =>
        this.articlesApiService.getArticle(articleId).pipe(
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

        return this.articlesApiService.addArticle(article).pipe(
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

        return this.articlesApiService.updateArticle(updatedArticle).pipe(
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
        return this.articlesApiService.updateArticle(updatedArticle).pipe(
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
        this.articlesApiService.deleteArticle(article.id).pipe(
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
    private readonly articlesApiService: ArticlesApiService,
    private readonly store: Store,
  ) {}
}
