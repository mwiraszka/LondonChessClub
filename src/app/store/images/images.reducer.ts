import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Image } from '@app/models';
import { customSort } from '@app/utils';

import * as ImagesActions from './images.actions';

export type ImagesState = EntityState<Image>;

export const imagesAdapter = createEntityAdapter<Image>({
  sortComparer: (a, b) => customSort(a, b, 'modificationInfo.dateCreated', true),
});

export const imagesInitialState: ImagesState = imagesAdapter.getInitialState({});

export const imagesReducer = createReducer(
  imagesInitialState,

  on(
    ImagesActions.fetchArticleBannerImageThumbnailsSucceeded,
    (state, { images }): ImagesState => imagesAdapter.upsertMany(images, state),
  ),

  on(
    ImagesActions.fetchArticleBannerImageSucceeded,
    (state, { image }): ImagesState => imagesAdapter.upsertOne(image, state),
  ),

  on(
    ImagesActions.addImageSucceeded,
    (state, { image }): ImagesState => imagesAdapter.addOne(image, state),
  ),

  on(
    ImagesActions.deleteImageSucceeded,
    (state, { image }): ImagesState =>
      imagesAdapter.removeMany([image.id!, `${image.id}-thumb`], state),
  ),
);
