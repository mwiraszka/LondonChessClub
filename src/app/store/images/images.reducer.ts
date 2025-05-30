import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import { IMAGE_FORM_DATA_PROPERTIES, Image, ImageFormData } from '@app/models';
import { customSort } from '@app/utils';

import * as ImagesActions from './images.actions';

export const INITIAL_IMAGE_FORM_DATA: ImageFormData = {
  caption: '',
  albums: [],
  newAlbum: '',
};

export type ImagesState = EntityState<{ image: Image; formData: ImageFormData }>;

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
        images.map(image => ({
          image,
          formData: { ...pick(image, IMAGE_FORM_DATA_PROPERTIES), newAlbum: '' },
        })),
        state,
      ),
  ),

  on(
    ImagesActions.fetchImageSucceeded,
    (state, { image }): ImagesState =>
      imagesAdapter.upsertOne(
        {
          image,
          formData: { ...pick(image, IMAGE_FORM_DATA_PROPERTIES), newAlbum: '' },
        },
        state,
      ),
  ),

  on(
    ImagesActions.addImageSucceeded,
    (state, { image }): ImagesState =>
      imagesAdapter.upsertOne(
        {
          image,
          formData: { ...pick(image, IMAGE_FORM_DATA_PROPERTIES), newAlbum: '' },
        },
        { ...state, newImageFormData: INITIAL_IMAGE_FORM_DATA },
      ),
  ),

  on(
    ImagesActions.updateImageSucceeded,
    (state, { baseImage }): ImagesState =>
      imagesAdapter.upsertOne(
        {
          image: baseImage,
          formData: { ...pick(baseImage, IMAGE_FORM_DATA_PROPERTIES), newAlbum: '' },
        },
        state,
      ),
  ),

  on(
    ImagesActions.deleteImageSucceeded,
    (state, { imageId }): ImagesState =>
      imagesAdapter.removeMany([imageId, `${imageId}-thumb`], state),
  ),

  on(ImagesActions.formValueChanged, (state, { imageId, value }): ImagesState => {
    const originalImage = imageId ? state.entities[imageId] : null;

    return originalImage
      ? imagesAdapter.updateOne(
          {
            id: imageId,
            changes: {
              formData: { ...originalImage.formData, ...value },
            },
          },
          state,
        )
      : state;
  }),
);
