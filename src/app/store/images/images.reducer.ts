import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { compact, pick } from 'lodash';

import { IMAGE_FORM_DATA_PROPERTIES, INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import {
  CallState,
  DataPaginationOptions,
  Id,
  Image,
  ImageFormData,
  IsoDate,
} from '@app/models';
import { customSort } from '@app/utils';

import * as ImagesActions from './images.actions';

export interface ImagesState
  extends EntityState<{ image: Image; formData: ImageFormData }> {
  callState: CallState;
  newImagesFormData: Record<string, ImageFormData>;
  lastMetadataFetch: IsoDate | null;
  lastFilteredThumbnailsFetch: IsoDate | null;
  lastAlbumCoversFetch: IsoDate | null;
  filteredImages: Image[];
  options: DataPaginationOptions<Image>;
  filteredCount: number | null;
  totalCount: number;
}

export const imagesAdapter = createEntityAdapter<{
  image: Image;
  formData: ImageFormData;
}>({
  selectId: ({ image }) => image.id,
  sortComparer: (a, b) =>
    customSort(a, b, 'image.albumOrdinality', false, 'image.caption', false),
});

export const initialState: ImagesState = imagesAdapter.getInitialState({
  callState: {
    status: 'idle',
    loadStart: null,
    error: null,
  },
  newImagesFormData: {},
  lastMetadataFetch: null,
  lastFilteredThumbnailsFetch: null,
  lastAlbumCoversFetch: null,
  filteredImages: [],
  options: {
    page: 1,
    pageSize: 20,
    sortBy: 'modificationInfo',
    sortOrder: 'desc',
    filters: {},
    search: '',
  },
  filteredCount: null,
  totalCount: 0,
});

export const imagesReducer = createReducer(
  initialState,

  on(
    ImagesActions.fetchAllImagesMetadataRequested,
    ImagesActions.fetchFilteredThumbnailsRequested,
    ImagesActions.fetchBatchThumbnailsRequested,
    ImagesActions.fetchMainImageRequested,
    ImagesActions.addImageRequested,
    ImagesActions.addImagesRequested,
    ImagesActions.updateImageRequested,
    ImagesActions.updateAlbumRequested,
    ImagesActions.deleteImageRequested,
    ImagesActions.deleteAlbumRequested,
    (state): ImagesState => ({
      ...state,
      callState: {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      },
    }),
  ),

  on(
    ImagesActions.fetchAllImagesMetadataFailed,
    ImagesActions.fetchFilteredThumbnailsFailed,
    ImagesActions.fetchBatchThumbnailsFailed,
    ImagesActions.fetchMainImageFailed,
    ImagesActions.addImageFailed,
    ImagesActions.addImagesFailed,
    ImagesActions.updateImageFailed,
    ImagesActions.updateAlbumFailed,
    ImagesActions.deleteImageFailed,
    ImagesActions.deleteAlbumFailed,
    (state, { error }): ImagesState => ({
      ...state,
      callState: {
        status: 'error',
        loadStart: null,
        error,
      },
    }),
  ),

  on(
    ImagesActions.fetchAllImagesMetadataSucceeded,
    (state, { images }): ImagesState =>
      imagesAdapter.upsertMany(
        images.map(image => {
          const originalEntity = image ? state.entities[image.id] : null;

          return {
            image: {
              ...image,
              mainUrl: originalEntity?.image.mainUrl,
              thumbnailUrl: originalEntity?.image.thumbnailUrl,
            },
            formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
          };
        }),
        {
          ...state,
          callState: initialState.callState,
          lastMetadataFetch: new Date(Date.now()).toISOString(),
        },
      ),
  ),

  on(
    ImagesActions.fetchFilteredThumbnailsSucceeded,
    (state, { images, filteredCount, totalCount }): ImagesState => {
      return imagesAdapter.upsertMany(
        images.map(image => {
          const originalEntity = image ? state.entities[image.id] : null;

          return {
            image: {
              ...image,
              mainUrl: originalEntity?.image.mainUrl,
            },
            formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
          };
        }),
        {
          ...state,
          callState: initialState.callState,
          lastFilteredThumbnailsFetch: new Date(Date.now()).toISOString(),
          filteredImages: images,
          filteredCount,
          totalCount,
        },
      );
    },
  ),

  on(
    ImagesActions.fetchBatchThumbnailsSucceeded,
    (state, { images, context }): ImagesState =>
      imagesAdapter.upsertMany(
        images.map(image => {
          const originalEntity = image ? state.entities[image.id] : null;

          return {
            image: {
              ...image,
              mainUrl: originalEntity?.image.mainUrl,
            },
            formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
          };
        }),
        {
          ...state,
          callState: initialState.callState,
          lastAlbumCoversFetch:
            context === 'album-covers'
              ? new Date(Date.now()).toISOString()
              : state.lastAlbumCoversFetch,
        },
      ),
  ),

  on(
    ImagesActions.paginationOptionsChanged,
    (state, { options }): ImagesState => ({
      ...state,
      options,
      lastFilteredThumbnailsFetch: null,
    }),
  ),

  on(ImagesActions.fetchMainImageSucceeded, (state, { image }): ImagesState => {
    const originalEntity = image ? state.entities[image.id] : null;

    return imagesAdapter.upsertOne(
      {
        image: {
          ...image,
          mainUrl: image.mainUrl ?? originalEntity?.image.mainUrl,
        },
        formData: originalEntity?.formData ?? pick(image, IMAGE_FORM_DATA_PROPERTIES),
      },
      { ...state, callState: initialState.callState },
    );
  }),

  on(ImagesActions.addImageSucceeded, (state, { image }): ImagesState => {
    return imagesAdapter.upsertOne(
      {
        image,
        formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
      },
      {
        ...state,
        callState: initialState.callState,
        newImagesFormData: {},
        lastFilteredThumbnailsFetch: null,
        lastAlbumCoversFetch: null,
        lastMetadataFetch: null,
      },
    );
  }),

  on(ImagesActions.addImagesSucceeded, (state, { images }): ImagesState => {
    return imagesAdapter.upsertMany(
      images.map(image => {
        const originalEntity = image ? state.entities[image.id] : null;

        return {
          image: {
            ...image,
            mainUrl: image.mainUrl ?? originalEntity?.image.mainUrl,
            thumbnailUrl: image.thumbnailUrl ?? originalEntity?.image.thumbnailUrl,
          },
          formData: pick(image, IMAGE_FORM_DATA_PROPERTIES),
        };
      }),
      {
        ...state,
        callState: initialState.callState,
        newImagesFormData: {},
        lastFilteredThumbnailsFetch: null,
        lastAlbumCoversFetch: null,
        lastMetadataFetch: null,
      },
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
        {
          ...state,
          callState: initialState.callState,
          lastFilteredThumbnailsFetch: null,
          lastAlbumCoversFetch: null,
          lastMetadataFetch: null,
        },
      ),
  ),

  on(ImagesActions.updateAlbumSucceeded, (state, { baseImages }): ImagesState => {
    const updatedEntities = compact(
      baseImages.map(baseImage => {
        const originalEntity = baseImage ? state.entities[baseImage.id] : null;
        if (!originalEntity) {
          console.warn(
            `[LCC] Unable to find image ${baseImage.id} after successful album update`,
          );
          return undefined;
        }
        return {
          image: { ...originalEntity.image, ...baseImage },
          formData: pick(baseImage, IMAGE_FORM_DATA_PROPERTIES),
        };
      }),
    );

    return imagesAdapter.upsertMany(updatedEntities, {
      ...state,
      callState: initialState.callState,
      lastFilteredThumbnailsFetch: null,
      lastAlbumCoversFetch: null,
      lastMetadataFetch: null,
      newImagesFormData: {},
    });
  }),

  on(
    ImagesActions.deleteImageSucceeded,
    (state, { image }): ImagesState =>
      imagesAdapter.removeOne(image.id, {
        ...state,
        callState: initialState.callState,
        lastFilteredThumbnailsFetch: null,
        lastAlbumCoversFetch: null,
        lastMetadataFetch: null,
      }),
  ),

  on(
    ImagesActions.deleteAlbumSucceeded,
    (state, { imageIds }): ImagesState =>
      imagesAdapter.removeMany(imageIds, {
        ...state,
        callState: initialState.callState,
        lastFilteredThumbnailsFetch: null,
        lastAlbumCoversFetch: null,
        lastMetadataFetch: null,
      }),
  ),

  on(ImagesActions.formDataChanged, (state, { multipleFormData }): ImagesState => {
    if (!multipleFormData.length) {
      return state;
    }

    const newImageValues: (Partial<ImageFormData> & { id: Id })[] = [];
    const existingImageValues: (Partial<ImageFormData> & { id: Id })[] = [];

    multipleFormData.forEach(formData => {
      if (formData.id.toString().startsWith('new')) {
        newImageValues.push(formData);
      } else {
        existingImageValues.push(formData);
      }
    });

    let newImagesFormData = { ...state.newImagesFormData };

    newImageValues.forEach(formData => {
      const { id } = formData;
      const existingFormData = newImagesFormData[id] || INITIAL_IMAGE_FORM_DATA;

      newImagesFormData = {
        ...newImagesFormData,
        [id]: {
          ...existingFormData,
          ...formData,
        },
      };
    });

    const updatedEntities = compact(
      existingImageValues.map(formData => {
        const { id } = formData;
        const originalEntity = state.entities[id];

        if (!originalEntity) {
          console.warn(
            `[LCC] Could not find image ${id} to update after form data change`,
          );
          return undefined;
        }

        return {
          ...originalEntity,
          formData: {
            ...originalEntity.formData,
            ...formData,
          },
        };
      }),
    );

    const stateWithNewImages = { ...state, newImagesFormData };

    return updatedEntities.length > 0
      ? imagesAdapter.upsertMany(updatedEntities, stateWithNewImages)
      : stateWithNewImages;
  }),

  on(ImagesActions.imageFormDataRestored, (state, { imageId }): ImagesState => {
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

  on(ImagesActions.albumFormDataRestored, (state, { imageIds }): ImagesState => {
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

  on(
    ImagesActions.requestTimedOut,
    (state): ImagesState => ({
      ...state,
      callState: {
        status: 'error',
        loadStart: null,
        error: { name: 'LCCError', message: 'Request timed out' },
      },
    }),
  ),
);
