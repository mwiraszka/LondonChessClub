import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ImagesService, LoaderService, LocalStorageService } from '@app/services';
import { parseError } from '@app/utils/error/parse-error.util';

import { IMAGE_KEY } from '.';
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
      switchMap(({ imageId }) =>
        this.imagesService.getImage(imageId).pipe(
          map(response =>
            ImagesActions.fetchArticleBannerImageSucceeded({ image: response.data }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchArticleBannerImageFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImageRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(() => {
        const imageDataUrl = this.localStorageService.get<string>(IMAGE_KEY);

        if (!imageDataUrl) {
          return of(
            ImagesActions.addImageFailed({
              error: { message: 'Unable to retrieve image data URL from local storage.' },
            }),
          );
        }

        const byteString = atob(imageDataUrl.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          int8Array[i] = byteString.charCodeAt(i);
        }
        const imageFile: Blob = new Blob([int8Array], { type: 'image/jpeg' });
        const imageFormData = new FormData();
        imageFormData.append('imageFile', imageFile);

        return this.imagesService.addImage(imageFormData).pipe(
          map(response => ImagesActions.addImageSucceeded({ image: response.data })),
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
    private readonly localStorageService: LocalStorageService,
  ) {}
}
