import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseImage, LccError } from '@app/models';
import { ImagesService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { dataUrlToFile, isDefined } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import { ImagesActions, ImagesSelectors } from '.';

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
      switchMap(({ baseImage, dataUrl }) => {
        const imageFile = dataUrlToFile(dataUrl, baseImage.filename);

        if (!imageFile) {
          const error: LccError = {
            name: 'LCCError',
            message: 'Unable to construct file object from image data URL.',
          };
          return of(ImagesActions.addImageFailed({ error }));
        }

        const imageFormData = new FormData();
        imageFormData.append('imageFile', imageFile);

        return this.imagesService.addImage(imageFormData, baseImage).pipe(
          map(response => ImagesActions.addImageSucceeded({ image: response.data })),
          catchError(error =>
            of(ImagesActions.addImageFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.updateImageRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(({ imageId }) => [
        this.store
          .select(ImagesSelectors.selectImageById(imageId))
          .pipe(filter(isDefined)),
        this.store
          .select(ImagesSelectors.selectImageFormDataById(imageId))
          .pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, image, formData, user]) => {
        const updatedImage: BaseImage = {
          id: image.id,
          filename: image.filename,
          fileSize: image.fileSize,
          coverForAlbum: image.coverForAlbum,
          caption: formData.caption,
          albums: formData.newAlbum
            ? [...formData.albums, formData.newAlbum].sort()
            : formData.albums,
          modificationInfo: {
            ...image.modificationInfo,
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.imagesService.updateImage(updatedImage).pipe(
          filter(response => response.data === image.id),
          map(() => ImagesActions.updateImageSucceeded({ baseImage: updatedImage })),
          catchError(error =>
            of(
              ImagesActions.updateImageFailed({
                error: parseError(error),
              }),
            ),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageRequested),
      switchMap(({ image }) => {
        const imageId = image.id.split('-thumb')[0];
        return this.imagesService.deleteImage(imageId).pipe(
          filter(response => response.data === imageId),
          map(() =>
            ImagesActions.deleteImageSucceeded({
              imageId,
              imageFilename: image.filename,
            }),
          ),
          catchError(error =>
            of(ImagesActions.deleteImageFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly imagesService: ImagesService,
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}
}
