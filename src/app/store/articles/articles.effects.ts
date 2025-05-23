import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import type { Article } from '@app/models';
import { ArticlesService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { isDefined } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

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
          map(response =>
            ArticlesActions.fetchArticlesSucceeded({ articles: response.data }),
          ),
          catchError(error =>
            of(ArticlesActions.fetchArticlesFailed({ error: parseError(error) })),
          ),
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
          map(response =>
            ArticlesActions.fetchArticleSucceeded({ article: response.data }),
          ),
          catchError(error =>
            of(ArticlesActions.fetchArticleFailed({ error: parseError(error) })),
          ),
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
          .select(ArticlesSelectors.selectArticleFormDataById(null))
          .pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, formData, user]) => {
        const article: Omit<Article, 'id'> & { id: null } = {
          id: null,
          title: formData.title,
          body: formData.body,
          bannerImageId: formData.bannerImageId,
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
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(({ articleId }) => [
        this.store
          .select(ArticlesSelectors.selectArticleById(articleId))
          .pipe(filter(isDefined)),
        this.store
          .select(ArticlesSelectors.selectArticleFormDataById(articleId))
          .pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, article, formData, user]) => {
        const updatedArticle: Article = {
          id: article.id,
          title: formData.title,
          body: formData.body,
          bannerImageId: formData.bannerImageId,
          bookmarkDate: null,
          modificationInfo: {
            createdBy: `${user.firstName} ${user.lastName}`,
            dateCreated: moment().toISOString(),
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
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
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateArticleBookmarkRequested$ = createEffect(() => {
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
        return this.articlesService.updateArticle(modifiedArticle).pipe(
          map(() => ArticlesActions.updateArticleSucceeded({ article: modifiedArticle })),
          catchError(error =>
            of(ArticlesActions.updateArticleFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ articleId }) =>
        this.articlesService.deleteArticle(articleId).pipe(
          switchMap(response =>
            this.store.select(ArticlesSelectors.selectArticleById(response.data)),
          ),
          filter(isDefined),
          map(article =>
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
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly articlesService: ArticlesService,
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}
}
