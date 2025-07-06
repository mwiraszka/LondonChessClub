import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { compact, pick } from 'lodash';

import { IMAGE_FORM_DATA_PROPERTIES, INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { Image, ImageFormData } from '@app/models';
import { customSort } from '@app/utils';

import * as ImagesActions from './images.actions';

export interface ImagesState
  extends EntityState<{ image: Image; formData: ImageFormData }> {
  newImagesFormData: Record<string, ImageFormData>;
}

export const imagesAdapter = createEntityAdapter<{
  image: Image;
  formData: ImageFormData;
}>({
  selectId: ({ image }) => image.id,
  sortComparer: (a, b) => customSort(a, b, 'image.modificationInfo.dateCreated', true),
});

export const initialState: ImagesState = imagesAdapter.getInitialState({
  newImagesFormData: {},
});

export const imagesReducer = createReducer(
  initialState,

  on(
    ImagesActions.fetchImageThumbnailsSucceeded,
    (state, { images }): ImagesState =>
      imagesAdapter.upsertMany(
        images.map(image => {
          const originalEntity = image ? state.entities[image.id] : null;

          return {
            image: {
              ...image,
              originalUrl: image.originalUrl ?? originalEntity?.image.originalUrl,
              thumbnailUrl: image.thumbnailUrl ?? originalEntity?.image.thumbnailUrl,
            },
            formData: {
              ...pick(image, IMAGE_FORM_DATA_PROPERTIES),
              album: '',
            },
          };
        }),
        state,
      ),
  ),

  on(ImagesActions.fetchImageSucceeded, (state, { image }): ImagesState => {
    const originalEntity = image ? state.entities[image.id] : null;

    return imagesAdapter.upsertOne(
      {
        image: {
          ...image,
          originalUrl: image.originalUrl ?? originalEntity?.image.originalUrl,
          thumbnailUrl: image.thumbnailUrl ?? originalEntity?.image.thumbnailUrl,
        },
        formData: originalEntity?.formData ?? {
          ...pick(image, IMAGE_FORM_DATA_PROPERTIES),
          album: '',
        },
      },
      state,
    );
  }),

  on(ImagesActions.fetchImagesSucceeded, (state, { images }): ImagesState => {
    return imagesAdapter.upsertMany(
      images.map(image => {
        const originalEntity = image ? state.entities[image.id] : null;

        return {
          image: {
            ...image,
            originalUrl: image.originalUrl ?? originalEntity?.image.originalUrl,
            thumbnailUrl: image.thumbnailUrl ?? originalEntity?.image.thumbnailUrl,
          },
          formData: originalEntity?.formData ?? {
            ...pick(image, IMAGE_FORM_DATA_PROPERTIES),
            album: '',
          },
        };
      }),
      state,
    );
  }),

  on(
    ImagesActions.addImageSucceeded,
    (state, { image }): ImagesState =>
      imagesAdapter.upsertOne(
        {
          image,
          formData: {
            ...pick(image, IMAGE_FORM_DATA_PROPERTIES),
            album: '',
          },
        },
        { ...state, newImagesFormData: {} },
      ),
  ),

  on(ImagesActions.addImagesSucceeded, (state, { images }): ImagesState => {
    return imagesAdapter.upsertMany(
      images.map(image => {
        const originalEntity = image ? state.entities[image.id] : null;

        return {
          image: {
            ...image,
            originalUrl: image.originalUrl ?? originalEntity?.image.originalUrl,
            thumbnailUrl: image.thumbnailUrl ?? originalEntity?.image.thumbnailUrl,
          },
          formData: {
            ...pick(image, IMAGE_FORM_DATA_PROPERTIES),
            album: '',
          },
        };
      }),
      { ...state, newImagesFormData: {} },
    );
  }),

  on(
    ImagesActions.updateImageSucceeded,
    ImagesActions.automaticAlbumCoverSwitchSucceeded,
    (state, { baseImage }): ImagesState =>
      imagesAdapter.upsertOne(
        {
          image: baseImage,
          formData: {
            ...pick(baseImage, IMAGE_FORM_DATA_PROPERTIES),
            album: '',
          },
        },
        state,
      ),
  ),

  on(ImagesActions.updateAlbumSucceeded, (state, { baseImages }): ImagesState => {
    return imagesAdapter.upsertMany(
      compact(
        baseImages.map(baseImage => {
          const originalEntity = baseImage ? state.entities[baseImage.id] : null;

          if (!originalEntity) {
            console.warn(
              `[LCC] Unable to find image ${baseImage.id} after successful album update`,
            );
            return undefined;
          }

          return {
            image: {
              ...originalEntity.image,
              ...baseImage,
            },
            formData: {
              ...pick(baseImage, IMAGE_FORM_DATA_PROPERTIES),
              album: '',
            },
          };
        }),
      ),
      { ...state, newImagesFormData: {} },
    );
  }),

  on(
    ImagesActions.deleteImageSucceeded,
    (state, { image }): ImagesState => imagesAdapter.removeOne(image.id, state),
  ),

  on(
    ImagesActions.deleteAlbumSucceeded,
    (state, { imageIds }): ImagesState => imagesAdapter.removeMany(imageIds, state),
  ),

  on(ImagesActions.formValueChanged, (state, { imageId, value }): ImagesState => {
    if (imageId.startsWith('new')) {
      const newImagesFormData =
        imageId in (state.newImagesFormData || {})
          ? {
              ...state.newImagesFormData,
              [imageId]: {
                ...state.newImagesFormData[imageId],
                ...value,
              },
            }
          : {
              [imageId]: {
                ...INITIAL_IMAGE_FORM_DATA,
                ...value,
              },
            };

      return { ...state, newImagesFormData };
    }

    const originalImage = state.entities[imageId];

    if (!originalImage) {
      console.error(
        `[LCC] Could not find image ${imageId} to update after form value change`,
      );
      return state;
    }

    return imagesAdapter.upsertOne(
      {
        ...originalImage,
        formData: {
          ...originalImage.formData,
          ...value,
        },
      },
      state,
    );
  }),

  on(ImagesActions.imageFormDataReset, (state, { imageId }): ImagesState => {
    if (!imageId) {
      return { ...state, newImagesFormData: {} };
    }

    const originalImage = state.entities[imageId]?.image;
    if (!originalImage) {
      console.warn(`[LCC] Unable to find image ${imageId} for image form data reset`);
      return state;
    }

    return imagesAdapter.upsertOne(
      {
        image: originalImage,
        formData: {
          ...pick(originalImage, IMAGE_FORM_DATA_PROPERTIES),
          album: '',
        },
      },
      { ...state, newImagesFormData: {} },
    );
  }),

  on(ImagesActions.imagesFormDataReset, (state, { imageIds }): ImagesState => {
    return imagesAdapter.upsertMany(
      compact(
        imageIds.map(imageId => {
          const originalImage = state.entities[imageId]?.image;

          if (!originalImage) {
            console.warn(
              `[LCC] Unable to find image ${imageId} for images form data reset`,
            );
            return undefined;
          }

          return {
            image: originalImage,
            formData: {
              ...pick(originalImage, IMAGE_FORM_DATA_PROPERTIES),
              album: '',
            },
          };
        }),
      ),
      { ...state, newImagesFormData: {} },
    );
  }),
);
