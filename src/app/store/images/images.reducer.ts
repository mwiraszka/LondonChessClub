import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import { IMAGE_EDIT_FORM_DATA_PROPERTIES, Image, ImageEditFormData } from '@app/models';
import { customSort } from '@app/utils';

import * as ImagesActions from './images.actions';

export type ImagesState = EntityState<{ image: Image; formData: ImageEditFormData }>;

export const imagesAdapter = createEntityAdapter<{
  image: Image;
  formData: ImageEditFormData;
}>({
  selectId: ({ image }) => image.id,
  sortComparer: (a, b) => customSort(a, b, 'image.modificationInfo.dateCreated', true),
});

export const initialState: ImagesState = imagesAdapter.getInitialState({});

export const imagesReducer = createReducer(
  initialState,

  on(
    ImagesActions.fetchImageThumbnailsSucceeded,
    ImagesActions.addImagesSucceeded,
    (state, { images }): ImagesState =>
      imagesAdapter.upsertMany(
        images.map(image => ({
          image,
          formData: { caption: image.caption, albums: image.albums, newAlbum: '' },
        })),
        state,
      ),
  ),

  on(
    ImagesActions.fetchImageSucceeded,
    ImagesActions.updateImageSucceeded,
    (state, { image }): ImagesState =>
      imagesAdapter.upsertOne(
        {
          image,
          formData: { ...pick(image, IMAGE_EDIT_FORM_DATA_PROPERTIES), newAlbum: '' },
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
