import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesService, ImagesService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { type Article, type ModificationInfo, type ServiceResponse } from '@app/types';

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
          map((response: ServiceResponse<Article[]>) =>
            response.error
              ? ArticlesActions.fetchArticlesFailed({ error: response.error })
              : ArticlesActions.fetchArticlesSucceeded({
                  articles: response.payload!,
                }),
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
          map((response: ServiceResponse<Article>) =>
            response.error
              ? ArticlesActions.fetchArticleFailed({
                  error: response.error,
                })
              : ArticlesActions.fetchArticleSucceeded({
                  article: response.payload!,
                }),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  publishArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleConfirmed),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.formArticle),
        this.store.select(AuthSelectors.user),
      ]),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(([, articleToPublish, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: `${user!.firstName} ${user!.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedArticle = { ...articleToPublish!, modificationInfo };

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
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleConfirmed),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.formArticle),
        this.store.select(AuthSelectors.user),
      ]),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(([, articleToUpdate, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: articleToUpdate!.modificationInfo!.createdBy,
          dateCreated: articleToUpdate!.modificationInfo!.dateCreated,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedArticle = { ...articleToUpdate!, modificationInfo };

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
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleConfirmed),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.setArticle)),
      tap(() => this.loaderService.setIsLoading(true)),
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
                  article: response.payload!,
                }),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  requestThumbnailImageUrls$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticlesSucceeded),
      map(({ articles }) =>
        ArticlesActions.getArticleThumbnailImageUrlsRequested({ articles }),
      ),
    );
  });

  getThumbnailImageUrls$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.getArticleThumbnailImageUrlsRequested),
      switchMap(({ articles }) =>
        this.imagesService.getArticleThumbnailImageUrls(articles),
      ),
      map((response: ServiceResponse<Article[]>) => {
        return response.error
          ? ArticlesActions.getArticleThumbnailImageUrlsFailed({
              error: response.error,
            })
          : ArticlesActions.getArticleThumbnailImageUrlsSucceeded({
              articles: response.payload!,
            });
      }),
    );
  });

  requestImageUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleSucceeded),
      map(({ article }) => ArticlesActions.getArticleImageUrlRequested({ article })),
    );
  });

  getImageUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.getArticleImageUrlRequested),
      switchMap(({ article }) => {
        return this.imagesService
          .getArticleImageUrl(article?.imageId)
          .pipe(
            map(response =>
              response.error
                ? { error: response.error }
                : { payload: { ...article, imageUrl: response.payload } as Article },
            ),
          );
      }),
      map(response => {
        return response.error
          ? ArticlesActions.getArticleImageUrlFailed({ error: response.error })
          : ArticlesActions.getArticleImageUrlSucceeded({
              article: response.payload,
            });
      }),
    );
  });

  requestImageFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.getArticleImageUrlSucceeded),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.controlMode)),
      filter(([, controlMode]) => controlMode !== null),
      map(([{ article }]) =>
        ArticlesActions.getArticleImageFileRequested({ imageUrl: article.imageUrl! }),
      ),
    );
  });

  getImageFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.getArticleImageFileRequested),
      switchMap(({ imageUrl }) => this.imagesService.getArticleImageFile(imageUrl)),
      map((response: ServiceResponse<File>) =>
        response.error
          ? ArticlesActions.getArticleImageFileFailed({ error: response.error })
          : ArticlesActions.getArticleImageFileSucceeded({
              imageFile: response.payload!,
            }),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private articlesService: ArticlesService,
    private imagesService: ImagesService,
    private loaderService: LoaderService,
  ) {}
}
