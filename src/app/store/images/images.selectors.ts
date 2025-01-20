import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { Id } from '@app/models';

import { ImagesState, imagesAdapter } from './images.reducer';

const selectImagesState = createFeatureSelector<ImagesState>('imagesState');

const { selectAll: selectAllImages } = imagesAdapter.getSelectors(selectImagesState);

export const selectThumbnailImages = createSelector(selectAllImages, allImages =>
  allImages.filter(image => image.id.endsWith('-600x400')),
);

export const selectImageById = (id: Id) =>
  createSelector(selectAllImages, allImages =>
    allImages ? allImages.find(image => image.id === id) : null,
  );
