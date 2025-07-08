import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { compact, pick } from 'lodash';

import { IMAGE_FORM_DATA_PROPERTIES, INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { Id, Image, ImageFormData } from '@app/models';
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
            formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
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
        formData: originalEntity?.formData ?? pick(image, IMAGE_FORM_DATA_PROPERTIES),
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
          formData: originalEntity?.formData ?? pick(image, IMAGE_FORM_DATA_PROPERTIES),
        };
      }),
      state,
    );
  }),

  on(ImagesActions.addImageSucceeded, (state, { image }): ImagesState => {
    return imagesAdapter.upsertOne(
      {
        image,
        formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
      },
      { ...state, newImagesFormData: {} },
    );
  }),

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
          formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
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
          formData: pick(baseImage, IMAGE_FORM_DATA_PROPERTIES),
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
            formData: pick(baseImage, IMAGE_FORM_DATA_PROPERTIES),
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

  on(ImagesActions.formValueChanged, (state, { values }): ImagesState => {
    if (!values.length) {
      return state;
    }

    const newImageValues: (Partial<ImageFormData> & { id: Id })[] = [];
    const existingImageValues: (Partial<ImageFormData> & { id: Id })[] = [];

    values.forEach(value => {
      if (value.id.toString().startsWith('new')) {
        newImageValues.push(value);
      } else {
        existingImageValues.push(value);
      }
    });

    let newImagesFormData = { ...state.newImagesFormData };

    newImageValues.forEach(value => {
      const { id } = value;
      const existingFormData = newImagesFormData[id] || INITIAL_IMAGE_FORM_DATA;

      newImagesFormData = {
        ...newImagesFormData,
        [id]: {
          ...existingFormData,
          ...value,
        },
      };
    });

    const updatedEntities = compact(
      existingImageValues.map(value => {
        const { id } = value;
        const originalEntity = state.entities[id];

        if (!originalEntity) {
          console.warn(
            `[LCC] Could not find image ${id} to update after form value change`,
          );
          return undefined;
        }

        return {
          ...originalEntity,
          formData: {
            ...originalEntity.formData,
            ...value,
          },
        };
      }),
    );

    const stateWithNewImages = { ...state, newImagesFormData };

    return updatedEntities.length > 0
      ? imagesAdapter.upsertMany(updatedEntities, stateWithNewImages)
      : stateWithNewImages;
  }),

  on(ImagesActions.imageFormDataReset, (state, { imageId }): ImagesState => {
    const originalImage = state.entities[imageId]?.image;

    if (!originalImage) {
      return { ...state, newImagesFormData: {} };
    }

    return imagesAdapter.upsertOne(
      {
        image: originalImage,
        formData: pick(originalImage, IMAGE_FORM_DATA_PROPERTIES),
      },
      { ...state, newImagesFormData: {} },
    );
  }),

  on(ImagesActions.albumFormDataReset, (state, { imageIds }): ImagesState => {
    return imagesAdapter.upsertMany(
      compact(
        imageIds.map(imageId => {
          const originalImage = state.entities[imageId]?.image;

          if (!originalImage) {
            console.warn(
              `[LCC] Unable to find image ${imageId} for album form data reset`,
            );
            return undefined;
          }

          return {
            image: originalImage,
            formData: pick(originalImage, IMAGE_FORM_DATA_PROPERTIES),
          };
        }),
      ),
      { ...state, newImagesFormData: {} },
    );
  }),

  on(ImagesActions.newImageRemoved, (state, { imageId }): ImagesState => {
    const { [imageId]: removed, ...restNewImagesFormData } = state.newImagesFormData;

    return {
      ...state,
      newImagesFormData: restNewImagesFormData,
    };
  }),

  on(ImagesActions.allNewImagesRemoved, (state): ImagesState => {
    return {
      ...state,
      newImagesFormData: {},
    };
  }),
);
