/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesService, ImagesService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { Article, ModificationInfo, ServiceResponse, Url } from '@app/types';

import * as ArticlesActions from './articles.actions';
import * as ArticlesSelectors from './articles.selectors';

@Injectable()
export class ArticlesEffects {
  fetchArticles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticlesRequested),
      switchMap(() =>
        this.articlesService.getArticles().pipe(
          map((response: ServiceResponse<Article[]>) =>
            response.error
              ? ArticlesActions.fetchArticlesFailed({ error: response.error })
              : ArticlesActions.fetchArticlesSucceeded({
                  allArticles: response.payload!,
                }),
          ),
        ),
      ),
    );
  });

  fetchArticleForViewScreen$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleForViewScreenRequested),
      tap(() => this.loaderService.display(true)),
      switchMap(({ articleId }) =>
        this.articlesService.getArticle(articleId).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.fetchArticleForViewScreenFailed({
                  error: response.error,
                })
              : ArticlesActions.fetchArticleForViewScreenSucceeded({
                  article: response.payload!,
                }),
          ),
        ),
      ),
      tap(() => this.loaderService.display(false)),
    );
  });

  setArticleForViewing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleForViewScreenSucceeded),
      map(({ article }) => ArticlesActions.articleSetForViewing({ article })),
    );
  });

  fetchArticleForEditScreen$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleForEditScreenRequested),
      tap(() => this.loaderService.display(true)),
      switchMap(({ articleId }) =>
        this.articlesService.getArticle(articleId).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.fetchArticleForEditScreenFailed({
                  error: response.error,
                })
              : ArticlesActions.fetchArticleForEditScreenSucceeded({
                  article: response.payload!,
                }),
          ),
        ),
      ),
      tap(() => this.loaderService.display(false)),
    );
  });

  setArticleForEditing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleForEditScreenSucceeded),
      map(({ article }) => ArticlesActions.articleSetForEditing({ article })),
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.selectedArticle)),
      tap(() => this.loaderService.display(true)),
      filter(([, articleToDelete]) => !!articleToDelete),
      switchMap(([, articleToDelete]) =>
        this.imagesService.deleteArticleImage(articleToDelete!),
      ),
      switchMap(response => {
        if (response.error) {
          return throwError(() => new Error('Unable to delete image'));
        }
        return this.articlesService.deleteArticle(response!.payload!).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.deleteArticleFailed({ error: response.error })
              : ArticlesActions.deleteArticleSucceeded({
                  deletedArticle: response.payload!,
                }),
          ),
        );
      }),
      tap(() => this.loaderService.display(false)),
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleConfirmed),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.articleCurrently),
        this.store.select(AuthSelectors.user),
      ]),
      tap(() => this.loaderService.display(true)),
      switchMap(([, articleToPublish, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: `${user!.firstName} ${user!.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedArticle = { ...articleToPublish, modificationInfo };

        return this.articlesService.addArticle(modifiedArticle).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.publishArticleFailed({ error: response.error })
              : ArticlesActions.publishArticleSucceeded({
                  article: response.payload!,
                }),
          ),
        );
      }),
      tap(() => this.loaderService.display(false)),
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleConfirmed),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.articleCurrently),
        this.store.select(AuthSelectors.user),
      ]),
      tap(() => this.loaderService.display(true)),
      switchMap(([, articleToUpdate, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: articleToUpdate.modificationInfo!.createdBy,
          dateCreated: articleToUpdate.modificationInfo!.dateCreated,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedArticle = { ...articleToUpdate, modificationInfo };

        return this.articlesService.updateArticle(modifiedArticle).pipe(
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.updateArticleFailed({ error: response.error })
              : ArticlesActions.updateArticleSucceeded({
                  article: response.payload!,
                }),
          ),
        );
      }),
      tap(() => this.loaderService.display(false)),
    );
  });

  getImageUrlForSelectedArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.articleSetForEditing, ArticlesActions.articleSetForViewing),
      switchMap(({ article }) => this.imagesService.getArticleImageUrl(article.imageId!)),
      map((response: ServiceResponse<Url>) =>
        response.error
          ? ArticlesActions.getArticleImageUrlFailed({ error: response.error })
          : ArticlesActions.getArticleImageUrlSucceeded({ imageUrl: response.payload! }),
      ),
    );
  });

  resetArticleEditorForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter(
        (action: RouterNavigatedAction) =>
          action.payload.event.urlAfterRedirects === '/article/add',
      ),
      map(() => ArticlesActions.resetArticleForm()),
    ),
  );

  constructor(
    private actions$: Actions,
    private articlesService: ArticlesService,
    private imagesService: ImagesService,
    private loaderService: LoaderService,
    private store: Store,
  ) {}
}
