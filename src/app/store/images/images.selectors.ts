import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';

import type { Id } from '@app/models';
import { ArticlesSelectors } from '@app/store/articles';
import { areSame } from '@app/utils';

import { ImagesState, imagesAdapter } from './images.reducer';

const selectImagesState = createFeatureSelector<ImagesState>('imagesState');

const { selectAll: selectAllImageEntities } =
  imagesAdapter.getSelectors(selectImagesState);

export const selectNewImagesFormData = createSelector(
  selectImagesState,
  state => state.newImagesFormData,
);

export const selectNewImageFormDataByFilename = (filename: string) =>
  createSelector(
    selectNewImagesFormData,
    newImagesFormData => newImagesFormData[filename] ?? null,
  );

export const selectImageEntitiesByAlbum = (album: string | null) =>
  createSelector(selectAllImageEntities, allImageEntities => {
    return album
      ? (allImageEntities.filter(entity => entity.image.albums.includes(album)) ?? [])
      : [];
  });

export const selectAllImages = createSelector(selectAllImageEntities, allImageEntities =>
  allImageEntities.map(entity => entity.image),
);

export const selectPhotoImages = createSelector(selectAllImages, allImages =>
  allImages?.length
    ? allImages.filter(image => !image.albums.some(album => album?.startsWith('_')))
    : [],
);

export const selectImageEntityById = (id: Id | null) =>
  createSelector(
    selectAllImageEntities,
    allImageEntities => allImageEntities.find(entity => entity.image.id === id) ?? null,
  );

export const selectImageById = (id: Id) =>
  createSelector(
    selectAllImages,
    allImages => allImages.find(image => image.id === id) ?? null,
  );

export const selectImagesByIds = (ids: Id[]) =>
  createSelector(selectAllImages, allImages =>
    allImages.filter(image => ids.find(id => id === image.id)),
  );

export const selectImageFormDataById = (id: Id) =>
  createSelector(
    selectAllImageEntities,
    allImageEntities =>
      allImageEntities.find(entity => entity.image.id === id)?.formData ?? null,
  );

export const selectImageHasUnsavedChanges = (id: Id | null) =>
  createSelector(selectImageEntityById(id), entity => {
    if (!entity) {
      return null;
    }

    return !areSame(
      {
        ...pick(entity.image, Object.getOwnPropertyNames(entity.formData)),
        album: '',
      },
      entity.formData,
    );
  });

export const selectAlbumHasUnsavedChanges = (album: string | null) =>
  createSelector(selectImageEntitiesByAlbum(album), entities => {
    if (!entities.length) {
      return null;
    }

    return entities.some(
      entity =>
        !areSame(
          {
            ...pick(entity.image, Object.getOwnPropertyNames(entity.formData)),
            album: '',
          },
          entity.formData,
        ),
    );
  });

export const selectAllExistingAlbums = createSelector(selectAllImages, allImages => {
  const allAlbums = allImages.flatMap(image => image?.albums || []);
  return [...new Set(allAlbums)].sort();
});

export const selectImagesByAlbum = (album: string | null) =>
  createSelector(selectAllImages, allImages => {
    if (!album) {
      return null;
    }

    return allImages.filter(image => image?.albums?.includes(album)) ?? [];
  });

export const selectArticleImages = createSelector(selectAllImages, allImages => {
  return allImages.filter(image => (image?.articleAppearances ?? 0) > 0);
});

export const selectImageByArticleId = (articleId: Id | null) =>
  createSelector(
    selectAllImages,
    ArticlesSelectors.selectArticleById(articleId),
    ArticlesSelectors.selectArticleFormDataById(articleId),
    (allImages, article, articleFormData) => {
      const imageId = articleFormData.bannerImageId || article?.bannerImageId;
      return allImages?.find(image => image?.id === imageId) ?? null;
    },
  );
