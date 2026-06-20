import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { combineLatest, from, merge, of, race, timer } from 'rxjs';
import {
  catchError,
  exhaustMap,
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Article, BaseImage, IndexedDbImageData, LccError } from '@app/models';
import { ImageFileService, ImagesApiService } from '@app/services';
import { AppActions } from '@app/store/app';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { NavSelectors } from '@app/store/nav';
import {
  buildImagesFormData,
  dataUrlToFile,
  isDefined,
  isExpired,
  isLccError,
  parseError,
} from '@app/utils';

import { ImagesActions, ImagesSelectors } from '.';

@Injectable()
export class ImagesEffects {
  fetchAllImagesMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchAllImagesMetadataRequested),
      switchMap(() =>
        race(
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
          timer(10_000).pipe(map(() => ImagesActions.requestTimedOut())),
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
          timeout(30000),
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
        ImagesActions.fetchAllImagesMetadataSucceeded,
      ),
      switchMap(() =>
        this.store.select(ArticlesSelectors.selectHomePageArticles).pipe(
          concatLatestFrom(() =>
            this.store.select(ArticlesSelectors.selectFilteredArticles),
          ),
          map(([home, filtered]) => [...home, ...filtered]),
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
      filter(ids => ids.length > 0),
      map(imageIds =>
        ImagesActions.fetchBatchThumbnailsRequested({
          imageIds,
          context: 'article-banner-images',
        }),
      ),
    ),
  );

  fetchArticleImages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ArticlesActions.fetchArticleSucceeded,
        ArticlesActions.formDataChanged,
        ImagesActions.fetchAllImagesMetadataSucceeded,
      ),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.selectAllArticles)),
      mergeMap(([action, allArticles]) => {
        let articlesToProcess: Article[];

        if (action.type === ArticlesActions.fetchArticleSucceeded.type) {
          articlesToProcess = [action.article];
        } else if (action.type === ArticlesActions.formDataChanged.type) {
          articlesToProcess = allArticles.filter(
            a => a?.id === action.articleId,
          ) as Article[];
        } else {
          articlesToProcess = allArticles.filter(isDefined);
        }

        return from(articlesToProcess).pipe(
          mergeMap(article =>
            this.store.select(ImagesSelectors.selectImageIdsByArticleId(article.id)).pipe(
              take(1),
              map(imageIds => ({ article, imageIds })),
            ),
          ),
        );
      }),
      mergeMap(({ imageIds }) => {
        return from(imageIds).pipe(
          mergeMap(imageId =>
            this.store.select(ImagesSelectors.selectImageById(imageId)).pipe(
              take(1),
              map(image => ({ imageId, image })),
            ),
          ),
          filter(({ image }) => {
            // Refresh if the image is missing, has no main URL, or its presigned
            // URL is within 2h of expiring (backend issues 12h URLs).
            return (
              !image ||
              !image.mainUrl ||
              !image.urlExpirationDate ||
              moment(image.urlExpirationDate).isBefore(moment().add(2, 'hours'))
            );
          }),
          map(({ imageId }) =>
            ImagesActions.fetchMainImageInBackgroundRequested({ imageId }),
          ),
        );
      }),
    );
  });

  fetchMainImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchMainImageRequested),
      groupBy(({ imageId }) => imageId),
      mergeMap(group$ =>
        group$.pipe(
          exhaustMap(({ imageId }) =>
            this.imagesApiService.getMainImage(imageId).pipe(
              timeout(30000),
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
        ),
      ),
    );
  });

  fetchMainImageInBackground$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchMainImageInBackgroundRequested),
      groupBy(({ imageId }) => imageId),
      mergeMap(group$ =>
        group$.pipe(
          exhaustMap(({ imageId }) =>
            this.imagesApiService.getMainImage(imageId, true).pipe(
              timeout(30000),
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
        ),
      ),
    );
  });

  refetchMetadata$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        AppActions.refreshAppRequested,
        ImagesActions.addImageSucceeded,
        ImagesActions.addImagesSucceeded,
        ImagesActions.updateImageSucceeded,
        ImagesActions.updateAlbumSucceeded,
        ImagesActions.deleteImageSucceeded,
        ImagesActions.deleteAlbumSucceeded,
        ImagesActions.automaticAlbumCoverSwitchSucceeded,
      ),
    );

    const periodicCheck$ = timer(4000, 5 * 60 * 1000).pipe(
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
        AppActions.refreshAppRequested,
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

    const periodicCheck$ = timer(5500, 5 * 60 * 1000).pipe(
      switchMap(() =>
        combineLatest([
          this.store.select(ImagesSelectors.selectLastFilteredThumbnailsFetch),
          this.store.select(NavSelectors.selectCurrentPath),
        ]).pipe(take(1)),
      ),
      filter(
        ([lastFetch, currentPath]) =>
          isExpired(lastFetch) &&
          !!(
            currentPath?.includes('/photo-gallery') ||
            currentPath?.includes('/album') ||
            currentPath?.includes('/image')
          ),
      ),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => ImagesActions.fetchFilteredThumbnailsRequested()),
    );
  });

  refetchAlbumCoverThumbnails$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        AppActions.refreshAppRequested,
        ImagesActions.addImageSucceeded,
        ImagesActions.addImagesSucceeded,
        ImagesActions.updateImageSucceeded,
        ImagesActions.updateAlbumSucceeded,
        ImagesActions.deleteImageSucceeded,
        ImagesActions.deleteAlbumSucceeded,
        ImagesActions.automaticAlbumCoverSwitchSucceeded,
      ),
    );

    const periodicCheck$ = timer(7000, 5 * 60 * 1000).pipe(
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
    // Periodic check to retry failed/expired article banner images, but only
    // while the user is on a page that actually renders article banners.
    const periodicCheck$ = timer(5 * 60 * 1000, 10 * 60 * 1000).pipe(
      switchMap(() => this.store.select(NavSelectors.selectCurrentPath).pipe(take(1))),
      filter(
        currentPath =>
          currentPath === '' || currentPath === '/' || !!currentPath?.includes('/news'),
      ),
      switchMap(() =>
        combineLatest([
          this.store.select(ArticlesSelectors.selectHomePageArticles),
          this.store.select(ArticlesSelectors.selectFilteredArticles),
        ]).pipe(
          map(([home, filtered]) =>
            [...home, ...filtered].filter(article => article.bannerImageId),
          ),
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
      mergeMap(({ imageId }) => from(this.imageFileService.getImage(imageId))),
      concatLatestFrom(() => [
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
        this.store.select(ImagesSelectors.selectNewImageFormData).pipe(filter(isDefined)),
        this.store.select(ImagesSelectors.selectAllExistingAlbums),
      ]),
      mergeMap(([imageFileResult, user, formData, existingAlbums]) => {
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
          albumCover: !existingAlbums.includes(formData.album)
            ? true
            : formData.albumCover,
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
      mergeMap(() => from(this.imageFileService.getAllImages())),
      concatLatestFrom(() => [
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
        this.store.select(ImagesSelectors.selectNewImagesFormData),
      ]),
      mergeMap(([imageFilesResult, user, newImagesFormData]) => {
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

        const newImagesMetadata: Omit<BaseImage, 'fileSize'>[] = [];

        for (const indexedDbImage of imageFilesResult) {
          const { id, filename } = indexedDbImage;
          const formData = newImagesFormData[id];

          if (!formData) {
            const error: LccError = {
              name: 'LCCError',
              message: `Unable to retrieve form data for ${filename}`,
            };
            return of(ImagesActions.addImagesFailed({ error }));
          }

          newImagesMetadata.push({
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
          });
        }

        const result = buildImagesFormData(newImagesMetadata, imageFilesResult, []);

        if (isLccError(result)) {
          return of(ImagesActions.addImagesFailed({ error: result }));
        }

        return this.imagesApiService.addImages(result).pipe(
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
      mergeMap(([, { image, formData }, user]) => {
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

        const imagesFormData = buildImagesFormData([], [], [updatedImage]);

        if (isLccError(imagesFormData)) {
          return of(
            ImagesActions.updateImageFailed({
              baseImage: updatedImage,
              error: imagesFormData,
            }),
          );
        }

        return this.imagesApiService.updateImages(imagesFormData).pipe(
          map(response => {
            const { newImages, updatedImages } = response.data;

            if (newImages.length !== 0 || updatedImages.length !== 1) {
              const error: LccError = {
                name: 'LCCError',
                message: `Expected 0 images to be added and 1 image to be updated, but backend reported ${newImages.length} added and ${updatedImages.length} updated.`,
              };
              return ImagesActions.updateImageFailed({ baseImage: updatedImage, error });
            }

            return ImagesActions.updateImageSucceeded({ baseImage: updatedImage });
          }),
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
      mergeMap(({ album }) =>
        from(this.imageFileService.getAllImages()).pipe(
          map(indexedDbImageDataResult => ({ album, indexedDbImageDataResult })),
        ),
      ),
      concatLatestFrom(({ album }) => [
        this.store.select(ImagesSelectors.selectImageEntitiesByAlbum(album)),
        this.store.select(ImagesSelectors.selectNewImagesFormData),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      mergeMap(
        ([{ album, indexedDbImageDataResult }, entities, newImagesFormData, user]) => {
          const existingImages: BaseImage[] = entities.map(({ image, formData }) => ({
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

          const newImagesMetadata: Omit<BaseImage, 'fileSize'>[] = [];

          if (
            !isLccError(indexedDbImageDataResult) &&
            indexedDbImageDataResult.length > 0
          ) {
            for (const indexedDbImageData of indexedDbImageDataResult) {
              const { id, filename } = indexedDbImageData;
              const formData = newImagesFormData[id];

              if (!formData) {
                const error: LccError = {
                  name: 'LCCError',
                  message: 'Mismatch between image file data and form data',
                };
                return of(ImagesActions.updateAlbumFailed({ album, error }));
              }

              newImagesMetadata.push({
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
              });
            }
          }

          const imagesFormData = buildImagesFormData(
            newImagesMetadata,
            indexedDbImageDataResult as IndexedDbImageData[],
            existingImages,
          );

          if (isLccError(imagesFormData)) {
            return of(ImagesActions.updateAlbumFailed({ album, error: imagesFormData }));
          }

          return this.imagesApiService.updateImages(imagesFormData).pipe(
            map(response => {
              const { newImages, updatedImages } = response.data;

              if (
                newImages.length !== newImagesMetadata.length ||
                updatedImages.length !== existingImages.length
              ) {
                const error: LccError = {
                  name: 'LCCError',
                  message: `Expected ${newImagesMetadata.length} images to be added and ${existingImages.length} images to be updated, but backend reported ${newImages.length} added and ${updatedImages.length} updated.`,
                };
                return ImagesActions.updateAlbumFailed({ album, error });
              }

              return ImagesActions.updateAlbumSucceeded({
                album,
                newImages,
                updatedImages,
              });
            }),
            catchError(error =>
              of(ImagesActions.updateAlbumFailed({ album, error: parseError(error) })),
            ),
          );
        },
      ),
    );
  });

  deleteImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageRequested),
      mergeMap(({ image }) => {
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
      mergeMap(({ album }) => {
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
      mergeMap(updatedImage => {
        const imagesFormData = buildImagesFormData([], [], [updatedImage]);

        if (isLccError(imagesFormData)) {
          return of(
            ImagesActions.automaticAlbumCoverSwitchFailed({
              album: updatedImage.album,
              error: imagesFormData,
            }),
          );
        }

        return this.imagesApiService.updateImages(imagesFormData).pipe(
          map(response => {
            const { newImages, updatedImages } = response.data;

            if (newImages.length !== 0 || updatedImages.length !== 1) {
              const error: LccError = {
                name: 'LCCError',
                message: `Expected 0 images to be added and 1 image to be updated, but backend reported ${newImages.length} added and ${updatedImages.length} updated.`,
              };
              return ImagesActions.automaticAlbumCoverSwitchFailed({
                album: updatedImage.album,
                error,
              });
            }

            return ImagesActions.automaticAlbumCoverSwitchSucceeded({
              baseImage: updatedImage,
            });
          }),
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
