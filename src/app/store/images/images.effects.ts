import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import moment from 'moment-timezone';
import { from, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseImage, LccError } from '@app/models';
import { ImageFileService, ImagesApiService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { dataUrlToFile, isDefined, isLccError } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import { ImagesActions, ImagesSelectors } from '.';

@Injectable()
export class ImagesEffects {
  fetchAllImagesMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchAllImagesMetadataRequested),
      switchMap(() =>
        this.imagesApiService.getAllImagesMetadata().pipe(
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
    );
  });

  fetchFilteredThumbnailImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchFilteredThumbnailsRequested),
      concatLatestFrom(() => this.store.select(ImagesSelectors.selectOptions)),
      switchMap(([, options]) =>
        this.imagesApiService.getFilteredThumbnailImages(options).pipe(
          map(response =>
            ImagesActions.fetchFilteredThumbnailsSucceeded({
              images: response.data.items,
              filteredCount: response.data.filteredCount,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchFilteredThumbnailsFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
    );
  });

  refetchFilteredThumbnailsAfterPaginationOptionsChanged$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.paginationOptionsChanged),
      filter(({ fetch }) => fetch),
      map(() => ImagesActions.fetchFilteredThumbnailsRequested()),
    );
  });

  refetchFilteredThumbnails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ImagesActions.addImageSucceeded,
        ImagesActions.addImagesSucceeded,
        ImagesActions.updateImageSucceeded,
        ImagesActions.updateAlbumSucceeded,
        ImagesActions.deleteImageSucceeded,
        ImagesActions.deleteAlbumSucceeded,
      ),
      map(() => ImagesActions.fetchFilteredThumbnailsRequested()),
    );
  });

  fetchBatchThumbnailImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchBatchThumbnailsRequested),
      // Prevent duplicate back-to-back requests with identical params (e.g., double
      // emission on initial load of home page causing two network calls for the
      // same album cover thumbnails). We sort IDs to ensure stable comparison.
      map(({ imageIds, context }) => ({
        imageIds: [...imageIds].sort(),
        context,
      })),
      distinctUntilChanged((a, b) => a.context === b.context && isEqual(a.imageIds, b.imageIds)),
      mergeMap(({ imageIds, context }) =>
        this.imagesApiService.getBatchThumbnailImages(imageIds).pipe(
          map(response =>
            ImagesActions.fetchBatchThumbnailsSucceeded({
              images: response.data,
              context,
            }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchBatchThumbnailsFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
    );
  });

  fetchMainImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchMainImageRequested),
      switchMap(({ imageId }) =>
        this.imagesApiService.getMainImage(imageId).pipe(
          map(response =>
            ImagesActions.fetchMainImageSucceeded({ image: response.data }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchMainImageFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
    );
  });

  fetchMainImageInBackground$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchMainImageInBackgroundRequested),
      switchMap(({ imageId }) =>
        this.imagesApiService.getMainImage(imageId, true).pipe(
          map(response =>
            ImagesActions.fetchMainImageSucceeded({ image: response.data }),
          ),
          catchError(error =>
            of(
              ImagesActions.fetchMainImageFailed({
                error: parseError(error),
              }),
            ),
          ),
        ),
      ),
    );
  });

  addImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImageRequested),
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

        return this.imagesApiService.addImages(imageFormData).pipe(
          map(response => ImagesActions.addImageSucceeded({ image: response.data[0] })),
          catchError(error =>
            of(ImagesActions.addImageFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  addImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImagesRequested),
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

        return this.imagesApiService.addImages(imageFormData).pipe(
          map(response => ImagesActions.addImagesSucceeded({ images: response.data })),
          catchError(error =>
            of(ImagesActions.addImagesFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  updateImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.updateImageRequested),
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

        return this.imagesApiService.updateImages([updatedImage]).pipe(
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
    );
  });

  updateAlbum$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.updateAlbumRequested),
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

        return this.imagesApiService.updateImages(updatedImages).pipe(
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
    );
  });

  deleteImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageRequested),
      switchMap(({ image }) => {
        return this.imagesApiService.deleteImage(image.id).pipe(
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
      switchMap(({ album }) => {
        return this.imagesApiService.deleteAlbum(album).pipe(
          map(response =>
            ImagesActions.deleteAlbumSucceeded({ album, imageIds: response.data }),
          ),
          catchError(error =>
            of(ImagesActions.deleteAlbumFailed({ album, error: parseError(error) })),
          ),
        );
      }),
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
        return this.imagesApiService.updateImages([updatedImage]).pipe(
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

  fetchMissingArticleBannerThumbnails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.fetchHomePageArticlesSucceeded,
        ArticlesActions.fetchFilteredArticlesSucceeded,
        routerNavigatedAction,
      ),
      // Only care about home and news page routes when navigation occurs
      filter(action => {
        return action.type === routerNavigatedAction.type
          ? ['/', '/news'].includes(action.payload.event.url)
          : true;
      }),
      switchMap(() =>
        this.store.select(ArticlesSelectors.selectHomePageArticles).pipe(
          concatLatestFrom(() =>
            this.store.select(ArticlesSelectors.selectFilteredArticles),
          ),
          map(([home, filtered]) => [...home, ...filtered]),
        ),
      ),
      switchMap(articles =>
        this.store.select(
          ImagesSelectors.selectIdsOfArticleBannerImagesWithMissingThumbnailUrls(
            articles,
          ),
        ),
      ),
      distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
      filter(ids => ids.length > 0),
      map(imageIds =>
        ImagesActions.fetchBatchThumbnailsRequested({
          imageIds,
          context: 'article-banner-images',
        }),
      ),
    ),
  );

  clearIndexedDbImageFileData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ImagesActions.imageFormDataRestored, ImagesActions.albumFormDataRestored),
        tap(() => this.imageFileService.clearAllImages()),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly imageFileService: ImageFileService,
    private readonly imagesApiService: ImagesApiService,
    private readonly store: Store,
  ) {}
}
