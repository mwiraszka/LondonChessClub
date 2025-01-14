import { createReducer, on } from '@ngrx/store';
import { unionWith } from 'lodash';

import * as ImagesActions from './images.actions';
import { ImagesState, initialState } from './images.state';

export const imagesReducer = createReducer(
  initialState,

  on(
    ImagesActions.fetchArticleBannerImageThumbnailsSucceeded,
    (state, { images }): ImagesState => ({
      ...state,
      images: unionWith(state.images, images, (a, b) => a.id === b.id),
    }),
  ),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { image }): ImagesState => ({
      ...state,
      images: unionWith(state.images, [image], (a, b) => a.id === b.id),
    }),
  ),

  on(
    ImagesActions.addImageSucceeded,
    (state, { image }): ImagesState => ({
      ...state,
      images: [...state.images, image],
    }),
  ),

  on(
    ImagesActions.deleteImageSucceeded,
    (state, { image }): ImagesState => ({
      ...state,
      images: state.images.filter(
        storedImage =>
          storedImage.id !== image.id && storedImage.id !== `${image.id}-600x400`,
      ),
    }),
  ),

  on(
    ImagesActions.newImageStored,
    (state): ImagesState => ({
      ...state,
      isNewImageStored: true,
    }),
  ),

  on(
    ImagesActions.storedImageRemoved,
    (state): ImagesState => ({
      ...state,
      isNewImageStored: false,
    }),
  ),
);
