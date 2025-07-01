import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import { IMAGE_FORM_DATA_PROPERTIES, Image, ImageFormData } from '@app/models';
import { customSort } from '@app/utils';

import * as ImagesActions from './images.actions';

export const INITIAL_IMAGE_FORM_DATA: ImageFormData = {
  filename: '',
  caption: '',
  albums: [],
  album: '',
  dataUrl: '',
};

export interface ImagesState
  extends EntityState<{ image: Image; formData: ImageFormData }> {
  newImageFormData: ImageFormData;
}

export const imagesAdapter = createEntityAdapter<{
  image: Image;
  formData: ImageFormData;
}>({
  selectId: ({ image }) => image.id,
  sortComparer: (a, b) => customSort(a, b, 'image.modificationInfo.dateCreated', true),
});

export const initialState: ImagesState = imagesAdapter.getInitialState({
  newImageFormData: INITIAL_IMAGE_FORM_DATA,
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
              dataUrl: '',
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
          dataUrl: '',
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
            dataUrl: '',
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
            dataUrl: '',
          },
        },
        { ...state, newImageFormData: INITIAL_IMAGE_FORM_DATA },
      ),
  ),

  on(
    ImagesActions.updateImageSucceeded,
    ImagesActions.updateCoverImageSucceeded,
    (state, { baseImage }): ImagesState =>
      imagesAdapter.upsertOne(
        {
          image: baseImage,
          formData: {
            ...pick(baseImage, IMAGE_FORM_DATA_PROPERTIES),
            album: '',
            dataUrl: '',
          },
        },
        state,
      ),
  ),

  on(
    ImagesActions.deleteImageSucceeded,
    (state, { image }): ImagesState =>
      imagesAdapter.removeMany([image.id, `${image.id}-thumb`], state),
  ),

  on(ImagesActions.formValueChanged, (state, { imageId, value }): ImagesState => {
    const originalImage = imageId ? state.entities[imageId] : null;

    if (!originalImage) {
      return {
        ...state,
        newImageFormData: {
          ...state.newImageFormData,
          ...value,
        },
      };
    }

    return imagesAdapter.upsertOne(
      {
        ...originalImage,
        formData: {
          ...(originalImage?.formData ?? INITIAL_IMAGE_FORM_DATA),
          ...value,
        },
      },
      state,
    );
  }),

  on(ImagesActions.imageFormDataCleared, (state, { imageId }): ImagesState => {
    const originalArticle = imageId ? state.entities[imageId] : null;

    if (!originalArticle) {
      return {
        ...state,
        newImageFormData: INITIAL_IMAGE_FORM_DATA,
      };
    }

    return imagesAdapter.upsertOne(
      {
        ...originalArticle,
        formData: INITIAL_IMAGE_FORM_DATA,
      },
      state,
    );
  }),
);
