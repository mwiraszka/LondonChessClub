import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ArticlesService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { Article, ModificationInfo } from '@app/types';
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
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.fetchArticlesFailed({ errorResponse }));
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
      switchMap(({ articleId }) => {
        if (!articleId) {
          return of(ArticlesActions.newArticleFormTemplateLoaded());
        }

        return this.articlesService.getArticle(articleId).pipe(
          map(article => ArticlesActions.fetchArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.fetchArticleFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store
          .select(ArticlesSelectors.selectArticleFormData)
          .pipe(filter(isDefined)),
        this.store.select(ArticlesSelectors.selectIsNewImageStored),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
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
          thumbnailImageUrl: null,
        };

        const imageDataUrl = localStorage.getItem(LOCAL_STORAGE_IMAGE_KEY);
        if (isNewImageStored && !imageDataUrl) {
          const error = new Error(
            'Unable to retrieve image data URL from local storage.',
          );
          return of(ArticlesActions.publishArticleFailed({ error }));
        }

        return this.articlesService.addArticle(modifiedArticle, imageDataUrl).pipe(
          map(article => ArticlesActions.publishArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            const error = new Error(`[${errorResponse.status}] ${errorResponse.error}`);
            return of(ArticlesActions.publishArticleFailed({ error }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.selectArticle).pipe(filter(isDefined)),
        this.store
          .select(ArticlesSelectors.selectArticleFormData)
          .pipe(filter(isDefined)),
        this.store.select(ArticlesSelectors.selectIsNewImageStored),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
      ]),
      switchMap(([, article, articleFormData, isNewImageStored, user]) => {
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

        const imageDataUrl = localStorage.getItem(LOCAL_STORAGE_IMAGE_KEY);
        if (isNewImageStored && !imageDataUrl) {
          const error = new Error(
            'Unable to retrieve image data URL from local storage.',
          );
          return of(ArticlesActions.publishArticleFailed({ error }));
        }

        return this.articlesService.updateArticle(modifiedArticle, imageDataUrl).pipe(
          map(article => ArticlesActions.updateArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            const error = new Error(`[${errorResponse.status}] ${errorResponse.error}`);
            return of(ArticlesActions.updateArticleFailed({ error }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() =>
        this.store.select(ArticlesSelectors.selectArticle).pipe(filter(isDefined)),
      ),
      switchMap(([, article]) =>
        this.articlesService.deleteArticle(article).pipe(
          map(article => ArticlesActions.deleteArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(ArticlesActions.deleteArticleFailed({ errorResponse }));
          }),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private articlesService: ArticlesService,
    private loaderService: LoaderService,
  ) {}
}
