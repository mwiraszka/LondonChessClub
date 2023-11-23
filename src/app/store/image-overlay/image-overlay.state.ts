import { Photo } from '@app/types';

export interface ImageOverlayState {
  photo: Photo | null;
}

export const initialState: ImageOverlayState = {
  photo: null,
};
