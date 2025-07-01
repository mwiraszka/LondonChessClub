import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { Id, IsoDate, Url } from './core.model';
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
  urlExpirationDate?: IsoDate;
  originalUrl?: Url;
  thumbnailUrl?: Url;
  articleAppearances?: number;
}

// Single image form
export const IMAGE_FORM_DATA_PROPERTIES = ['filename', 'caption', 'albums'] as const;

export type ImageFormData = Pick<
  BaseImage,
  (typeof IMAGE_FORM_DATA_PROPERTIES)[number]
> & { album: string; dataUrl: Url };

export type ImageFormGroup = {
  [Property in keyof ImageFormData]: FormControl<ImageFormData[Property]>;
};

// Multiple images form
export const IMAGE_ITEM_FORM_DATA_PROPERTIES = ['id', 'filename', 'caption'] as const;

type ImageItemFormData = Pick<
  BaseImage,
  (typeof IMAGE_ITEM_FORM_DATA_PROPERTIES)[number]
> & { dataUrl: Url };

export type ImageItemFormGroup = {
  [Property in keyof ImageItemFormData]: FormControl<ImageItemFormData[Property]>;
};

export interface ImagesFormGroup {
  album: FormControl<string>;
  albums: FormControl<string[]>;
  albumCover: FormControl<string>;
  images: FormArray<FormGroup<ImageItemFormGroup>>;
}
