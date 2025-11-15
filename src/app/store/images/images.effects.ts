import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import moment from 'moment-timezone';
import { from, merge, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseImage, LccError } from '@app/models';
import { ImageFileService, ImagesApiService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { dataUrlToFile, isDefined, isExpired, isLccError, parseError } from '@app/utils';

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

  fetchBatchThumbnailImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchBatchThumbnailsRequested),
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

  fetchAlbumThumbnailImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchAlbumThumbnailsRequested),
      // Ensure metadata has been loaded; if not, fetch it first
      mergeMap(({ album }) =>
        this.store.select(ImagesSelectors.selectLastMetadataFetch).pipe(
          take(1),
          switchMap(lastFetch => {
            if (!lastFetch) {
              // Trigger metadata fetch and wait until it succeeds before proceeding
              this.store.dispatch(ImagesActions.fetchAllImagesMetadataRequested());
              return this.actions$.pipe(
                ofType(ImagesActions.fetchAllImagesMetadataSucceeded),
                take(1),
                switchMap(() =>
                  this.store
                    .select(ImagesSelectors.selectImagesByAlbum(album))
                    .pipe(take(1)),
                ),
              );
            }
            return this.store
              .select(ImagesSelectors.selectImagesByAlbum(album))
              .pipe(take(1));
          }),
          filter(ids => !!ids.length),
          map(images => images.map(image => image.id)),
          switchMap(imageIds =>
            this.imagesApiService.getBatchThumbnailImages(imageIds).pipe(
              map(response =>
                ImagesActions.fetchBatchThumbnailsSucceeded({
                  images: response.data,
                  context: 'photos-in-album',
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
        ),
      ),
    );
  });

  fetchArticleBannerThumbnails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.fetchHomePageArticlesSucceeded,
        ArticlesActions.fetchFilteredArticlesSucceeded,
      ),
      switchMap(() =>
        this.store.select(ArticlesSelectors.selectHomePageArticles).pipe(
          concatLatestFrom(() =>
            this.store.select(ArticlesSelectors.selectFilteredArticles),
          ),
          map(([home, filtered]) => [...home, ...filtered].sort()),
        ),
      ),
      switchMap(articles =>
        this.store.select(
          ImagesSelectors.selectIdsOfArticleBannerImagesWithMissingOrExpiredThumbnailUrls(
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

  refetchMetadata$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        ImagesActions.addImageSucceeded,
        ImagesActions.addImagesSucceeded,
        ImagesActions.updateImageSucceeded,
        ImagesActions.updateAlbumSucceeded,
        ImagesActions.deleteImageSucceeded,
        ImagesActions.deleteAlbumSucceeded,
        ImagesActions.automaticAlbumCoverSwitchSucceeded,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 5 * 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(ImagesSelectors.selectLastMetadataFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => ImagesActions.fetchAllImagesMetadataRequested()),
    );
  });

  refetchFilteredThumbnails$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        ImagesActions.addImageSucceeded,
        ImagesActions.addImagesSucceeded,
        ImagesActions.updateImageSucceeded,
        ImagesActions.updateAlbumSucceeded,
        ImagesActions.deleteImageSucceeded,
        ImagesActions.deleteAlbumSucceeded,
        ImagesActions.automaticAlbumCoverSwitchSucceeded,
        ImagesActions.paginationOptionsChanged,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 5 * 60 * 1000).pipe(
      switchMap(() =>
        this.store
          .select(ImagesSelectors.selectLastFilteredThumbnailsFetch)
          .pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => ImagesActions.fetchFilteredThumbnailsRequested()),
    );
  });

  refetchAlbumCoverThumbnails$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        ImagesActions.addImageSucceeded,
        ImagesActions.addImagesSucceeded,
        ImagesActions.updateImageSucceeded,
        ImagesActions.updateAlbumSucceeded,
        ImagesActions.deleteImageSucceeded,
        ImagesActions.deleteAlbumSucceeded,
        ImagesActions.automaticAlbumCoverSwitchSucceeded,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 5 * 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(ImagesSelectors.selectLastAlbumCoversFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      switchMap(() => this.store.select(ImagesSelectors.selectLastMetadataFetch)),
      filter(lastMetadataFetch => !isExpired(lastMetadataFetch)),
      switchMap(() =>
        this.store
          .select(ImagesSelectors.selectIdsOfAlbumCoversWithMissingOrExpiredThumbnailUrls)
          .pipe(take(1)),
      ),
      filter(imageIds => imageIds.length > 0),
      map(imageIds => {
        return ImagesActions.fetchBatchThumbnailsRequested({
          imageIds,
          context: 'album-covers',
        });
      }),
    );
  });

  retryFailedArticleBannerImages$ = createEffect(() => {
    // Periodic check to retry failed/expired article banner images
    const periodicCheck$ = timer(5 * 60 * 1000, 10 * 60 * 1000).pipe(
      switchMap(() =>
        merge(
          this.store.select(ArticlesSelectors.selectHomePageArticles),
          this.store.select(ArticlesSelectors.selectFilteredArticles),
        ).pipe(
          map(articles => articles.filter(article => article.bannerImageId)),
          take(1),
        ),
      ),
      switchMap(articles =>
        this.store
          .select(
            ImagesSelectors.selectIdsOfArticleBannerImagesWithMissingOrExpiredThumbnailUrls(
              articles,
            ),
          )
          .pipe(take(1)),
      ),
      filter(imageIds => imageIds.length > 0),
      map(imageIds =>
        ImagesActions.fetchBatchThumbnailsRequested({
          imageIds,
          context: 'article-banner-images',
        }),
      ),
    );

    return periodicCheck$;
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
