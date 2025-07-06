import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import type { BaseImage, LccError } from '@app/models';
import { ImageFileService, ImagesService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { dataUrlToFile, isDefined, isLccError } from '@app/utils';
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
    );
  });

  fetchImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchImagesRequested),
      switchMap(({ imageIds }) => {
        return this.imagesService.getImageBatch(imageIds).pipe(
          map(response => ImagesActions.fetchImagesSucceeded({ images: response.data })),
          catchError(error => {
            return of(
              ImagesActions.fetchImagesFailed({
                error: parseError(error),
              }),
            );
          }),
        );
      }),
    );
  });

  addImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImageRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(({ imageId }) => [
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
        this.store.select(ImagesSelectors.selectNewImageFormData).pipe(filter(isDefined)),
        from(this.imageFileService.getImage(imageId)),
      ]),
      switchMap(([, user, formData, imageFileResult]) => {
        if (isLccError(imageFileResult)) {
          return of(ImagesActions.addImageFailed({ error: imageFileResult }));
        }

        const file = dataUrlToFile(imageFileResult.dataUrl, formData.filename);

        if (!file) {
          const error: LccError = {
            name: 'LCCError',
            message: `Unable to construct file object from image data URL for ${formData.filename}`,
          };
          return of(ImagesActions.addImageFailed({ error }));
        }

        const imageMetadata: Omit<BaseImage, 'fileSize'> = {
          id: formData.id,
          filename: formData.filename,
          caption: formData.caption,
          coverForAlbum: formData.coverForAlbum,
          albums: formData.album
            ? [...formData.albums, formData.album].sort()
            : formData.albums,
          modificationInfo: {
            createdBy: `${user.firstName} ${user.lastName}`,
            dateCreated: moment().toISOString(),
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        const imageFormData = new FormData();
        imageFormData.append('files', file);
        imageFormData.append('imageMetadata', JSON.stringify(imageMetadata));

        return this.imagesService.addImages(imageFormData).pipe(
          map(response => ImagesActions.addImageSucceeded({ image: response.data[0] })),
          catchError(error =>
            of(ImagesActions.addImageFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImagesRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
        this.store.select(ImagesSelectors.selectNewImagesFormData),
        from(this.imageFileService.getAllImages()),
      ]),
      switchMap(([, user, newImagesFormData, imageFilesResult]) => {
        if (isLccError(imageFilesResult)) {
          return of(ImagesActions.addImageFailed({ error: imageFilesResult }));
        }

        if (!imageFilesResult.length) {
          const error: LccError = {
            name: 'LCCError',
            message: 'No image data found in IndexedDB',
          };
          return of(ImagesActions.addImageFailed({ error }));
        }

        const imageFormData = new FormData();

        for (const indexedDbImage of imageFilesResult) {
          const { filename, dataUrl } = indexedDbImage;
          const file = dataUrlToFile(dataUrl, filename);

          if (!file) {
            const error: LccError = {
              name: 'LCCError',
              message: `Unable to construct file object from image data URL for ${filename}`,
            };
            return of(ImagesActions.addImageFailed({ error }));
          }

          const formData = newImagesFormData[filename];

          if (!formData) {
            const error: LccError = {
              name: 'LCCError',
              message: `Unable to retrieve form data for ${filename}`,
            };
            return of(ImagesActions.addImageFailed({ error }));
          }

          const imageMetadata: Omit<BaseImage, 'fileSize'> = {
            id: '',
            filename,
            caption: formData.caption,
            coverForAlbum: formData.coverForAlbum,
            albums: formData.album
              ? [...formData.albums, formData.album].sort()
              : formData.albums,
            modificationInfo: {
              createdBy: `${user.firstName} ${user.lastName}`,
              dateCreated: moment().toISOString(),
              lastEditedBy: `${user.firstName} ${user.lastName}`,
              dateLastEdited: moment().toISOString(),
            },
          };

          imageFormData.append('files', file);
          imageFormData.append('imageMetadata', JSON.stringify(imageMetadata));
        }

        return this.imagesService.addImages(imageFormData).pipe(
          map(response => ImagesActions.addImagesSucceeded({ images: response.data })),
          catchError(error =>
            of(ImagesActions.addImagesFailed({ error: parseError(error) })),
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
          .select(ImagesSelectors.selectImageEntityById(imageId))
          .pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, { image, formData }, user]) => {
        const updatedImage: BaseImage = {
          id: image.id,
          filename: image.filename,
          fileSize: image.fileSize,
          caption: formData.caption,
          coverForAlbum: image.coverForAlbum,
          albums: formData.album
            ? [...formData.albums, formData.album].sort()
            : formData.albums,
          modificationInfo: {
            ...image.modificationInfo,
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.imagesService.updateImages([updatedImage]).pipe(
          filter(response => response.data[0] === image.id),
          map(() => ImagesActions.updateImageSucceeded({ baseImage: updatedImage })),
          catchError(error =>
            of(
              ImagesActions.updateImageFailed({
                baseImage: updatedImage,
                error: parseError(error),
              }),
            ),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateAlbum$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.updateAlbumRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(({ album }) => [
        this.store.select(ImagesSelectors.selectImageEntitiesByAlbum(album)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([{ album }, entities, user]) => {
        const updatedImages: BaseImage[] = entities.map(({ image, formData }) => ({
          id: image.id,
          filename: image.filename,
          fileSize: image.fileSize,
          caption: formData.caption,
          coverForAlbum: image.coverForAlbum,
          albums: formData.album
            ? [...formData.albums, formData.album].sort()
            : formData.albums,
          modificationInfo: {
            ...image.modificationInfo,
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        }));

        return this.imagesService.updateImages(updatedImages).pipe(
          map(() =>
            ImagesActions.updateAlbumSucceeded({ album, baseImages: updatedImages }),
          ),
          catchError(error =>
            of(
              ImagesActions.updateAlbumFailed({
                album,
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
        return this.imagesService.deleteImage(image.id).pipe(
          filter(response => response.data === image.id),
          map(() => ImagesActions.deleteImageSucceeded({ image })),
          catchError(error =>
            of(ImagesActions.deleteImageFailed({ image, error: parseError(error) })),
          ),
        );
      }),
    );
  });

  automaticallyUpdateAlbumCoverAfterImageDeletion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageSucceeded),
      filter(({ image }) => !!image.coverForAlbum),
      concatLatestFrom(({ image }) =>
        this.store.select(ImagesSelectors.selectImagesByAlbum(image.coverForAlbum)),
      ),
      filter(([, imagesInAlbum]) => !!imagesInAlbum?.length),
      map(([{ image }, imagesInAlbum]) => {
        const newAlbumCoverImage = imagesInAlbum![0];
        const updatedImage: BaseImage = {
          id: newAlbumCoverImage.id,
          filename: newAlbumCoverImage.filename,
          fileSize: newAlbumCoverImage.fileSize,
          caption: newAlbumCoverImage.caption,
          albums: newAlbumCoverImage.albums,
          modificationInfo: newAlbumCoverImage.modificationInfo,
          coverForAlbum: image.coverForAlbum,
        };
        return updatedImage;
      }),
      switchMap(updatedImage => {
        return this.imagesService.updateImages([updatedImage]).pipe(
          filter(response => response.data[0] === updatedImage.id),
          map(() =>
            ImagesActions.automaticAlbumCoverSwitchSucceeded({ baseImage: updatedImage }),
          ),
          catchError(error =>
            of(
              ImagesActions.automaticAlbumCoverSwitchFailed({
                album: updatedImage.coverForAlbum,
                error: parseError(error),
              }),
            ),
          ),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly imageFileService: ImageFileService,
    private readonly imagesService: ImagesService,
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}
}
