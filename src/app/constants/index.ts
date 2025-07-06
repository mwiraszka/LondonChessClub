import { ImageFormData } from '@app/models';

export const IMAGE_FORM_DATA_PROPERTIES = [
  'id',
  'filename',
  'caption',
  'albums',
  'coverForAlbum',
] as const;

export const INITIAL_IMAGE_FORM_DATA: ImageFormData = {
  id: '',
  filename: '',
  caption: '',
  albums: [],
  album: '',
  coverForAlbum: '',
};
