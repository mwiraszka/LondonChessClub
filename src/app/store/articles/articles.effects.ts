import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ArticlesService, LoaderService, LocalStorageService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { Article, LccError, ModificationInfo } from '@app/types';
import { isDefined, parseHttpErrorResponse } from '@app/utils';

import { LOCAL_STORAGE_IMAGE_KEY } from '.';
import * as ArticlesActions from './articles.actions';
import * as ArticlesSelectors from './articles.selectors';

@Injectable()
export class ArticlesEffects {
  fetchArticles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticlesRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(() =>
        this.articlesService.getArticles().pipe(
          map(articles => ArticlesActions.fetchArticlesSucceeded({ articles })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.fetchArticlesFailed({ error }));
          }),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ articleId }) =>
        this.articlesService.getArticle(articleId).pipe(
          map(article => ArticlesActions.fetchArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.fetchArticleFailed({ error }));
          }),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store
          .select(ArticlesSelectors.selectArticleFormData)
          .pipe(filter(isDefined)),
        this.store.select(ArticlesSelectors.selectIsNewImageStored),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, articleFormData, isNewImageStored, user]) => {
        const modificationInfo: ModificationInfo = {
          createdBy: `${user.firstName} ${user.lastName}`,
          dateCreated: moment().toISOString(),
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedArticle: Article = {
          ...articleFormData,
          modificationInfo,
          id: null,
          imageUrl: null,
          bookmarkDate: null,
          thumbnailImageUrl: null,
        };

        const imageDataUrl = this.localStorageService.get<string>(
          LOCAL_STORAGE_IMAGE_KEY,
        );
        if (isNewImageStored && !imageDataUrl) {
          const error = new Error(
            'Unable to retrieve image data URL from local storage.',
          );
          return of(ArticlesActions.publishArticleFailed({ error }));
        }

        return this.articlesService.addArticle(modifiedArticle, imageDataUrl).pipe(
          map(article => ArticlesActions.publishArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.publishArticleFailed({ error }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.selectArticle).pipe(filter(isDefined)),
        this.store
          .select(ArticlesSelectors.selectArticleFormData)
          .pipe(filter(isDefined)),
        this.store.select(ArticlesSelectors.selectIsNewImageStored),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, article, articleFormData, isNewImageStored, user]) => {
        const originalArticleTitle = article.title;
        const modificationInfo: ModificationInfo = {
          ...article.modificationInfo!,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedArticle = {
          ...article,
          ...articleFormData,
          modificationInfo,
        };

        const imageDataUrl = this.localStorageService.get<string>(
          LOCAL_STORAGE_IMAGE_KEY,
        );
        if (isNewImageStored && !imageDataUrl) {
          const error: LccError = {
            message: 'Unable to retrieve image data URL from local storage.',
          };
          return of(ArticlesActions.publishArticleFailed({ error }));
        }

        return this.articlesService.updateArticle(modifiedArticle, imageDataUrl).pipe(
          map(article =>
            ArticlesActions.updateArticleSucceeded({ article, originalArticleTitle }),
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.updateArticleFailed({ error }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateActicleBookmarkRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateActicleBookmarkRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(({ articleId }) =>
        this.store
          .select(ArticlesSelectors.selectArticleById(articleId))
          .pipe(filter(isDefined)),
      ),
      switchMap(([{ bookmark }, article]) => {
        const modifiedArticle: Article = {
          ...article,
          bookmarkDate: bookmark ? moment().toISOString() : null,
        };
        return this.articlesService.updateArticle(modifiedArticle, null).pipe(
          map(article => ArticlesActions.updateArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.updateArticleFailed({ error }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ article }) =>
        this.articlesService.deleteArticle(article).pipe(
          map(article => ArticlesActions.deleteArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.deleteArticleFailed({ error }));
          }),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly articlesService: ArticlesService,
    private readonly localStorageService: LocalStorageService,
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}
}
