import { createReducer, on } from '@ngrx/store';

import { IMAGE_KEY } from '.';
import { AppActions } from '../app';
import * as ImagesActions from './images.actions';
import { ImagesState, initialState } from './images.state';

export const imagesReducer = createReducer(
  initialState,

  on(
    ImagesActions.fetchArticleBannerImageThumbnailsSucceeded,
    (state, { images }): ImagesState => ({
      ...state,
      images: state.images.length
        ? state.images.map(storedImage => {
            const updatedImage = images.find(image => image.id === storedImage.id);
            return updatedImage ?? storedImage;
          })
        : state.images,
    }),
  ),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { image }): ImagesState => ({
      ...state,
      images: state.images.length
        ? [
            ...state.images.map(storedImage =>
              storedImage.id === image.id ? image : storedImage,
            ),
          ]
        : state.images,
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
    AppActions.itemSetInLocalStorage,
    (state, { key }): ImagesState => ({
      ...state,
      isNewImageStored: key === IMAGE_KEY ? true : state.isNewImageStored,
    }),
  ),

  on(
    AppActions.itemRemovedFromLocalStorage,
    (state, { key }): ImagesState => ({
      ...state,
      isNewImageStored: key === IMAGE_KEY ? false : state.isNewImageStored,
    }),
  ),
);
