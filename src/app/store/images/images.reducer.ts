import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { compact, pick } from 'lodash';

import { IMAGE_FORM_DATA_PROPERTIES, Image, ImageFormData } from '@app/models';
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

  on(
    ImagesActions.addImagesSucceeded,
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
        { ...state, newImagesFormData: {} },
      ),
  ),

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

  on(
    ImagesActions.updateAlbumSucceeded,
    (state, { baseImages }): ImagesState =>
      imagesAdapter.upsertMany(
        compact(
          baseImages.map(baseImage => {
            const originalEntity = baseImage ? state.entities[baseImage.id] : null;

            if (!originalEntity) {
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
      ),
  ),

  on(
    ImagesActions.deleteImageSucceeded,
    (state, { image }): ImagesState => imagesAdapter.removeOne(image.id, state),
  ),

  on(
    ImagesActions.deleteAlbumSucceeded,
    (state, { imageIds }): ImagesState => imagesAdapter.removeMany(imageIds, state),
  ),

  on(
    ImagesActions.formValueChanged,
    (state, { imageId, filename, value }): ImagesState => {
      if (imageId) {
        const originalImage = state.entities[imageId];

        if (!originalImage) {
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
      }

      // If no imageId, this is a new image, so add to or update
      // newImagesFormData record instead (keyed on the image's filename)
      return {
        ...state,
        newImagesFormData: {
          ...state.newImagesFormData,
          [filename]: {
            ...state.newImagesFormData[filename],
            ...value,
          },
        },
      };
    },
  ),

  on(ImagesActions.imageFormDataReset, (state, { imageId }): ImagesState => {
    const originalImage = imageId ? state.entities[imageId]?.image : null;

    if (!originalImage) {
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
      state,
    );
  }),
);
