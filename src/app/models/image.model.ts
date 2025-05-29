import { FormControl } from '@angular/forms';

import { Id, Url } from './core.model';
import { ModificationInfo } from './modification-info.model';

export interface BaseImage {
  id: Id;
  filename: string;
  fileSize: number;
  caption: string;
  albums: string[];
  coverForAlbum: string | null;
  modificationInfo: ModificationInfo;
}

export interface Image extends BaseImage {
  originalPresignedUrl?: Url;
  thumbnailPresignedUrl?: Url;
  articleAppearances?: number;
}

export const IMAGE_EDIT_FORM_DATA_PROPERTIES = ['caption', 'albums'] as const;

export type ImageEditFormData = Pick<
  BaseImage,
  (typeof IMAGE_EDIT_FORM_DATA_PROPERTIES)[number]
> & { newAlbum: string };

export type ImageEditFormGroup = {
  [Property in keyof ImageEditFormData]: FormControl<ImageEditFormData[Property]>;
};
