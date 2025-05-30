import { createFeatureSelector, createSelector } from '@ngrx/store';
import { pick } from 'lodash';

import type { Id } from '@app/models';
import { areSame } from '@app/utils';

import { ArticlesSelectors } from '../articles';
import { ImagesState, imagesAdapter } from './images.reducer';

const selectImagesState = createFeatureSelector<ImagesState>('imagesState');

const { selectAll: selectAllImageEntities } =
  imagesAdapter.getSelectors(selectImagesState);

export const selectImageEntitiesByAlbum = (album: string | null) =>
  createSelector(selectAllImageEntities, allImageEntities => {
    return album
      ? allImageEntities.filter(entity => entity.image.albums.includes(album))
      : null;
  });

export const selectAllImages = createSelector(selectAllImageEntities, allImageEntities =>
  allImageEntities.map(entity => entity?.image),
);

export const selectImageById = (id: Id) =>
  createSelector(selectAllImages, allImages =>
    allImages ? (allImages.find(image => image.id === id) ?? null) : null,
  );

export const selectImageFormDataById = (id: Id) =>
  createSelector(
    selectAllImageEntities,
    allImageEntities =>
      allImageEntities.find(entity => entity.image.id === id)?.formData ?? null,
  );

export const selectHasUnsavedChanges = (id: Id) =>
  createSelector(
    selectImageById(id),
    selectImageFormDataById(id),
    (image, imageFormData) => {
      if (!image || !imageFormData) {
        return false;
      }

      const formPropertiesOfOriginalImage = pick(
        image,
        Object.getOwnPropertyNames(imageFormData),
      );

      return !areSame({ ...formPropertiesOfOriginalImage, newAlbum: '' }, imageFormData);
    },
  );

export const selectAllExistingAlbums = createSelector(selectAllImages, allImages => {
  const allAlbums = allImages.flatMap(image => image.albums || []);
  return [...new Set(allAlbums)].sort();
});

export const selectImagesByAlbum = (album: string | null) =>
  createSelector(selectAllImages, allImages => {
    if (!album) {
      return null;
    }

    return allImages.filter(image => image.albums.includes(album)) ?? [];
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
      const imageId = articleFormData
        ? articleFormData.bannerImageId
        : article?.bannerImageId;
      return allImages?.find(image => image.id === imageId) ?? null;
    },
  );
