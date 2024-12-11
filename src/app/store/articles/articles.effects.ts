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
import type { ModificationInfo } from '@app/types';
import { isDefined } from '@app/utils';

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
          catchError((errorResponse: HttpErrorResponse) =>
            of(ArticlesActions.fetchArticlesFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.articleEditRequested, ArticlesActions.articleViewRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ articleId }) =>
        this.articlesService.getArticle(articleId).pipe(
          map(article => ArticlesActions.fetchArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ArticlesActions.fetchArticleFailed({ errorResponse })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.formArticle).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
      ]),
      switchMap(([, articleToPublish, user]) => {
        const dateNow = moment().toISOString();
        const modificationInfo: ModificationInfo = {
          createdBy: `${user.firstName} ${user.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedArticle = { ...articleToPublish, modificationInfo };

        return this.articlesService.addArticle(modifiedArticle).pipe(
          map(article => ArticlesActions.publishArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ArticlesActions.publishArticleFailed({ errorResponse })),
          ),
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
        this.store.select(ArticlesSelectors.formArticle).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
      ]),
      switchMap(([, articleToUpdate, user]) => {
        const modificationInfo: ModificationInfo = {
          createdBy: articleToUpdate.modificationInfo!.createdBy,
          dateCreated: articleToUpdate.modificationInfo!.dateCreated,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedArticle = { ...articleToUpdate, modificationInfo };

        return this.articlesService.updateArticle(modifiedArticle).pipe(
          map(article => ArticlesActions.updateArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ArticlesActions.updateArticleFailed({ errorResponse })),
          ),
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
        this.store.select(ArticlesSelectors.setArticle).pipe(filter(isDefined)),
      ),
      switchMap(([, articleToDelete]) =>
        this.articlesService.deleteArticle(articleToDelete).pipe(
          map(article => ArticlesActions.deleteArticleSucceeded({ article })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(ArticlesActions.deleteArticleFailed({ errorResponse })),
          ),
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
