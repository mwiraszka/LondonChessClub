import { Image } from '@app/models';

export interface ImagesState {
  images: Image[];
  isNewImageStored: boolean;
}

export const initialState: ImagesState = {
  images: [],
  isNewImageStored: false,
};
