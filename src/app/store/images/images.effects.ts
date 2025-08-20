import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseImage, LccError } from '@app/models';
import { ImageFileService, ImagesService, LoaderService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { dataUrlToFile, isDefined, isLccError } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import { ImagesActions, ImagesSelectors } from '.';

@Injectable()
export class ImagesEffects {
  fetchAllImagesMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchAllImagesMetadataRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(() =>
        this.imagesService.getAllImagesMetadata().pipe(
          map(response =>
            ImagesActions.fetchAllImagesMetadataSucceeded({
              images: response.data,
            }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchAllImagesMetadataFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchThumbnailImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchThumbnailsRequested),
      concatLatestFrom(() => this.store.select(ImagesSelectors.selectOptions)),
      switchMap(([, options]) =>
        this.imagesService.getThumbnailImages(options).pipe(
          map(response =>
            ImagesActions.fetchThumbnailsSucceeded({
              images: response.data.items,
              filteredCount: response.data.filteredCount,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchThumbnailsFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
    );
  });

  paginationOptionsChanged$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.paginationOptionsChanged),
      filter(({ fetch }) => fetch),
      map(() => ImagesActions.fetchThumbnailsRequested()),
    );
  });

  fetchBatchThumbnailImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchBatchThumbnailsRequested),
      switchMap(({ imageIds, context }) =>
        this.imagesService.getBatchThumbnailImages(imageIds).pipe(
          map(response =>
            ImagesActions.fetchBatchThumbnailsSucceeded({
              images: response.data,
              context,
            }),
          ),
          catchError(error => {
            return of(
              ImagesActions.fetchBatchThumbnailsFailed({
                error: parseError(error),
              }),
            );
          }),
        ),
      ),
    );
  });

  fetchOriginalImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchOriginalRequested),
      switchMap(({ imageId, isPrefetch }) => {
        return this.imagesService.getOriginalImage(imageId, isPrefetch).pipe(
          map(response => ImagesActions.fetchOriginalSucceeded({ image: response.data })),
          catchError(error => {
            return of(
              ImagesActions.fetchOriginalFailed({
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
      switchMap(({ imageId }) => from(this.imageFileService.getImage(imageId))),
      concatLatestFrom(() => [
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
        this.store.select(ImagesSelectors.selectNewImageFormData).pipe(filter(isDefined)),
      ]),
      switchMap(([imageFileResult, user, formData]) => {
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
          album: formData.album,
          albumCover: formData.albumCover,
          albumOrdinality: formData.albumOrdinality,
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
      switchMap(() => from(this.imageFileService.getAllImages())),
      concatLatestFrom(() => [
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
        this.store.select(ImagesSelectors.selectNewImagesFormData),
      ]),
      switchMap(([imageFilesResult, user, newImagesFormData]) => {
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
          const { id, dataUrl, filename } = indexedDbImage;
          const file = dataUrlToFile(dataUrl, filename);

          if (!file) {
            const error: LccError = {
              name: 'LCCError',
              message: `Unable to construct file object from image data URL for ${filename}`,
            };
            return of(ImagesActions.addImageFailed({ error }));
          }

          const formData = newImagesFormData[id];

          if (!formData) {
            const error: LccError = {
              name: 'LCCError',
              message: `Unable to retrieve form data for ${filename}`,
            };
            return of(ImagesActions.addImageFailed({ error }));
          }

          const imageMetadata: Omit<BaseImage, 'fileSize'> = {
            id,
            filename,
            caption: formData.caption,
            album: formData.album,
            albumCover: formData.albumCover,
            albumOrdinality: formData.albumOrdinality,
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
          caption: formData.caption,
          album: formData.album,
          albumCover: formData.albumCover,
          albumOrdinality: formData.albumOrdinality,
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
          caption: formData.caption,
          album: formData.album,
          albumCover: formData.albumCover,
          albumOrdinality: formData.albumOrdinality,
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

  deleteAlbum$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteAlbumRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ album, imageIds }) => {
        return this.imagesService.deleteAlbum(album).pipe(
          map(() => ImagesActions.deleteAlbumSucceeded({ album, imageIds })),
          catchError(error =>
            of(ImagesActions.deleteAlbumFailed({ album, error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  automaticallyUpdateAlbumCoverAfterImageDeletion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageSucceeded),
      filter(({ image }) => image.albumCover),
      concatLatestFrom(({ image }) =>
        this.store.select(ImagesSelectors.selectImagesByAlbum(image.album)),
      ),
      filter(([, imagesInAlbum]) => !!imagesInAlbum?.length),
      map(([, imagesInAlbum]) => {
        const newAlbumCoverImage = imagesInAlbum![0];
        const updatedImage: BaseImage = {
          id: newAlbumCoverImage.id,
          filename: newAlbumCoverImage.filename,
          caption: newAlbumCoverImage.caption,
          modificationInfo: newAlbumCoverImage.modificationInfo,
          album: newAlbumCoverImage.album,
          albumCover: true,
          albumOrdinality: newAlbumCoverImage.albumOrdinality,
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
                album: updatedImage.album,
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
