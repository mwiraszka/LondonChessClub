import { Photo } from '@app/types';
import { takeRandomly } from '@app/utils';

import { allPhotos } from '@assets/photos';

export interface PhotosState {
  photos: Photo[];
  overlayPhoto: Photo | null;
}

export const initialState: PhotosState = {
  photos: takeRandomly(allPhotos),
  overlayPhoto: null,
};
