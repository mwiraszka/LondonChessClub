import { createFeatureSelector, createSelector } from '@ngrx/store';
import { omit, pick, uniq } from 'lodash';

import { INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { Article, Id } from '@app/models';
import { ArticlesSelectors } from '@app/store/articles';
import { areSame } from '@app/utils';

import { ImagesState, imagesAdapter } from './images.reducer';

const selectImagesState = createFeatureSelector<ImagesState>('imagesState');

export const selectCallState = createSelector(
  selectImagesState,
  state => state.callState,
);

const { selectAll: selectAllImageEntities } =
  imagesAdapter.getSelectors(selectImagesState);

export const selectNewImagesFormData = createSelector(selectImagesState, state => {
  return state.newImagesFormData;
});

export const selectLastMetadataFetch = createSelector(selectImagesState, state => {
  return state.lastMetadataFetch;
});

export const selectLastFilteredThumbnailsFetch = createSelector(
  selectImagesState,
  state => {
    return state.lastFilteredThumbnailsFetch;
  },
);

export const selectLastAlbumCoversFetch = createSelector(selectImagesState, state => {
  return state.lastAlbumCoversFetch;
});

export const selectFilteredImages = createSelector(selectImagesState, state => {
  return state.filteredImages;
});

export const selectOptions = createSelector(selectImagesState, state => {
  return state.options;
});

export const selectFilteredCount = createSelector(selectImagesState, state => {
  return state.filteredCount;
});

export const selectTotalCount = createSelector(selectImagesState, state => {
  return state.totalCount;
});

export const selectNewImageFormData = createSelector(
  selectNewImagesFormData,
  newImagesFormData => {
    if (Object.keys(newImagesFormData).length > 1) {
      console.warn(
        '[LCC] Image data for multiple images found while selecting new image form data',
      );
      return null;
    }

    return Object.keys(newImagesFormData).length === 1
      ? Object.values(newImagesFormData)[0]
      : null;
  },
);

export const selectImageEntitiesByAlbum = (album: string | null) =>
  createSelector(selectAllImageEntities, allImageEntities =>
    album ? allImageEntities.filter(entity => entity.image.album === album) : [],
  );

export const selectAllImages = createSelector(selectAllImageEntities, allImageEntities =>
  allImageEntities.map(entity => entity.image),
);

export const selectImagesByAlbum = (album: string | null) =>
  createSelector(selectAllImages, allImages =>
    album ? allImages.filter(image => image.album === album) : [],
  );

export const selectPhotoImages = createSelector(selectAllImages, allImages =>
  allImages.filter(image => !image.album.startsWith('_')),
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

export const selectImageHasUnsavedChanges = (id: Id | null) =>
  createSelector(
    selectImageEntityById(id),
    selectNewImageFormData,
    (entity, newImageFormData) => {
      if (!id) {
        return (
          !!newImageFormData &&
          !areSame(omit(newImageFormData, 'id'), omit(INITIAL_IMAGE_FORM_DATA, 'id'))
        );
      }

      return (
        !!entity &&
        !areSame(
          pick(entity.image, Object.getOwnPropertyNames(entity.formData)),
          entity.formData,
        )
      );
    },
  );

export const selectAlbumHasUnsavedChanges = (album: string | null) =>
  createSelector(
    selectImageEntitiesByAlbum(album),
    selectNewImagesFormData,
    (entities, newImagesFormData) => {
      if (Object.keys(newImagesFormData).length > 0) {
        return true;
      }

      if (!album) {
        return false;
      }

      return (
        !!entities.length &&
        entities.some(
          entity =>
            !areSame(
              pick(entity.image, Object.getOwnPropertyNames(entity.formData)),
              entity.formData,
            ),
        )
      );
    },
  );

export const selectAllExistingAlbums = createSelector(selectAllImages, allImages => {
  return uniq(allImages.map(image => image.album));
});

export const selectArticleImages = createSelector(selectAllImages, allImages => {
  return allImages.filter(image => (image?.articleAppearances ?? 0) > 0);
});

export const selectIdsOfArticleBannerImagesWithMissingThumbnailUrls = (
  articles: Article[],
) =>
  createSelector(selectAllImages, allImages => {
    return uniq(
      articles
        .map(article => article.bannerImageId)
        .filter(
          bannerImageId =>
            !allImages.find(image => image.id === bannerImageId)?.thumbnailUrl,
        ),
    ).sort();
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
