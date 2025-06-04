import { FormControl } from '@angular/forms';

import { Id, Url } from './core.model';
import { ModificationInfo } from './modification-info.model';

export interface BaseImage {
  id: Id;
  filename: string;
  fileSize: number;
  caption: string;
  albums: string[];
  coverForAlbum: string;
  modificationInfo: ModificationInfo;
}

export interface Image extends BaseImage {
  width?: number;
  height?: number;
  originalPresignedUrl?: Url;
  thumbnailPresignedUrl?: Url;
  articleAppearances?: number;
}

export const IMAGE_FORM_DATA_PROPERTIES = ['filename', 'caption', 'albums'] as const;

export type ImageFormData = Pick<
  BaseImage,
  (typeof IMAGE_FORM_DATA_PROPERTIES)[number]
> & { newAlbum: string; dataUrl: Url };

export type ImageFormGroup = {
  [Property in keyof ImageFormData]: FormControl<ImageFormData[Property]>;
};
