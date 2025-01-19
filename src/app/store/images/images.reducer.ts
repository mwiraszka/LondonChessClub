import { createReducer, on } from '@ngrx/store';

import { Image } from '@app/models';
import { AppActions } from '@app/store/app';

import { IMAGE_KEY } from '.';
import * as ImagesActions from './images.actions';

export interface ImagesState {
  images: Image[];
  isNewImageStored: boolean;
}

export const imagesInitialState: ImagesState = {
  images: [],
  isNewImageStored: false,
};

export const imagesReducer = createReducer(
  imagesInitialState,

  on(
    ImagesActions.fetchArticleBannerImageThumbnailsSucceeded,
    (state, { images }): ImagesState => ({
      ...state,
      images: state.images.length
        ? state.images.map(storedImage => {
            const updatedImage = images.find(image => image.id === storedImage.id);
            return updatedImage ?? storedImage;
          })
        : images,
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
