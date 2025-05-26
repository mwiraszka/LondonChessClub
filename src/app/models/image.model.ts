import { FormControl } from '@angular/forms';

import { Id, Url } from './core.model';
import { ModificationInfo } from './modification-info.model';

export interface Image {
  id: Id;
  filename: string;
  fileSize: number;
  caption: string;
  presignedUrl: Url;
  albums: string[];
  coverForAlbum: string | null;
  modificationInfo: ModificationInfo;
  articleAppearances?: number;
}

export const IMAGE_FORM_DATA_PROPERTIES = [
  'filename',
  'caption',
  'albums',
  'coverForAlbum',
] as const;

export type ImageFormData = Pick<Image, (typeof IMAGE_FORM_DATA_PROPERTIES)[number]>;

export type ImageFormGroup = {
  [Property in keyof ImageFormData]: FormControl<ImageFormData[Property]>;
};
