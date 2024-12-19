import { allPhotos } from 'assets/photos';

import type { Photo } from '@app/types';
import { takeRandomly } from '@app/utils';

export interface PhotosState {
  photos: Photo[];
  photo: Photo | null;
}

export const initialState: PhotosState = {
  photos: takeRandomly(allPhotos),
  photo: null,
};
