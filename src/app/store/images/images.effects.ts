import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { LccError } from '@app/models';
import { ImagesService, LoaderService } from '@app/services';
import { dataUrlToFile } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import * as ImagesActions from './images.actions';

@Injectable()
export class ImagesEffects {
  fetchImageThumbnails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchImageThumbnailsRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(() =>
        this.imagesService.getThumbnailImages().pipe(
          map(response =>
            ImagesActions.fetchImageThumbnailsSucceeded({
              images: response.data,
            }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchImageThumbnailsFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchImageRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ imageId }) => {
        return this.imagesService.getImage(imageId).pipe(
          map(response => ImagesActions.fetchImageSucceeded({ image: response.data })),
          catchError(error => {
            return of(
              ImagesActions.fetchImageFailed({
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
      switchMap(({ dataUrl, filename, caption, forArticle }) => {
        const imageFile = dataUrlToFile(dataUrl, filename);

        if (!imageFile) {
          const error: LccError = {
            name: 'LCCError',
            message: 'Unable to construct file object from image data URL.',
          };
          return of(ImagesActions.addImageFailed({ error }));
        }

        const imageFormData = new FormData();
        imageFormData.append('imageFile', imageFile);

        return this.imagesService.addImage(imageFormData, caption).pipe(
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
        this.imagesService.deleteImage(image.id!).pipe(
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
  ) {}
}
