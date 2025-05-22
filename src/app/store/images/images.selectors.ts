import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { Id } from '@app/models';

import { ArticlesSelectors } from '../articles';
import { ImagesState, imagesAdapter } from './images.reducer';

const selectImagesState = createFeatureSelector<ImagesState>('imagesState');

const { selectAll: selectAllImages } = imagesAdapter.getSelectors(selectImagesState);

export const selectThumbnailImages = createSelector(selectAllImages, allImages =>
  allImages.filter(image => image?.id.endsWith('-thumb')),
);

export const selectImageById = (id: Id) =>
  createSelector(selectAllImages, allImages =>
    allImages ? allImages.find(image => image.id === id) : null,
  );

export const selectImageByArticleId = (articleId: Id | null) =>
  createSelector(
    selectAllImages,
    ArticlesSelectors.selectArticleById(articleId),
    ArticlesSelectors.selectArticleFormDataById(articleId),
    (allImages, article, articleFormData) => {
      const imageId = articleFormData
        ? articleFormData.bannerImageId
        : article?.bannerImageId;
      return allImages.find(image => image.id === imageId) ?? null;
    },
  );
