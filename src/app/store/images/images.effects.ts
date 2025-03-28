import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { LccError } from '@app/models';
import { ImagesService, LoaderService } from '@app/services';
import { ArticlesSelectors } from '@app/store/articles';
import { dataUrlToFile, isDefined } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import * as ImagesActions from './images.actions';

@Injectable()
export class ImagesEffects {
  fetchArticleBannerImageThumbnails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchArticleBannerImageThumbnailsRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(() =>
        this.imagesService.getThumbnailImages().pipe(
          map(response =>
            ImagesActions.fetchArticleBannerImageThumbnailsSucceeded({
              images: response.data,
            }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchArticleBannerImageThumbnailsFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchArticleBannerImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchArticleBannerImageRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ imageId, setAsOriginal }) => {
        return this.imagesService.getImage(imageId).pipe(
          map(response => {
            return ImagesActions.fetchArticleBannerImageSucceeded({
              image: response.data,
              setAsOriginal,
            });
          }),
          catchError(error => {
            return of(
              ImagesActions.fetchArticleBannerImageFailed({
                error: parseError(error),
              }),
            );
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImageRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(ArticlesSelectors.selectBannerImageUrl).pipe(filter(isDefined)),
        this.store
          .select(ArticlesSelectors.selectBannerImageFileData)
          .pipe(filter(isDefined)),
      ]),
      switchMap(([{ filename, forArticle }, dataUrl, fileData]) => {
        const imageFile = dataUrlToFile(dataUrl, filename, fileData);

        if (!imageFile) {
          const error: LccError = {
            name: 'LCCError',
            message: 'Unable to construct file object from image data URL.',
          };
          return of(ImagesActions.addImageFailed({ error }));
        }

        const imageFormData = new FormData();
        imageFormData.append('imageFile', imageFile);

        return this.imagesService.addImage(imageFormData).pipe(
          map(response =>
            ImagesActions.addImageSucceeded({ image: response.data, forArticle }),
          ),
          catchError(error =>
            of(ImagesActions.addImageFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageRequested),
      switchMap(({ image }) =>
        this.imagesService.deleteImage(image.id).pipe(
          map(() => ImagesActions.deleteImageSucceeded({ image })),
          catchError(error =>
            of(ImagesActions.deleteImageFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly imagesService: ImagesService,
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}
}
