import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { IMAGE_FORM_DATA_PROPERTIES } from '@app/constants';

import { Id, IsoDate, Url } from './core.model';
import { ModificationInfo } from './modification-info.model';

export interface BaseImage {
  id: Id;
  filename: string;
  caption: string;
  album: string;
  albumCover: boolean;
  albumOrdinality: string;
  modificationInfo: ModificationInfo;
}

export interface Image extends BaseImage {
  originalUrl?: Url;
  thumbnailUrl?: Url;
  urlExpirationDate?: IsoDate;
  width?: number;
  height?: number;
  fileSize?: number;
  articleAppearances?: number;
}

export type IndexedDbImageData = Pick<BaseImage, 'id' | 'filename'> & { dataUrl: Url };

export type ImageFormData = Pick<BaseImage, (typeof IMAGE_FORM_DATA_PROPERTIES)[number]>;

export type ImageFormGroup = {
  [Property in keyof ImageFormData]: FormControl<ImageFormData[Property]>;
};

export interface AlbumFormData {
  album: string;
  existingImages: Omit<ImageFormGroup, 'album'>[];
  newImages: Omit<ImageFormGroup, 'album'>[];
}

export interface AlbumFormGroup {
  album: FormControl<string>;
  existingImages: FormArray<FormGroup<Omit<ImageFormGroup, 'album'>>>;
  newImages: FormArray<FormGroup<Omit<ImageFormGroup, 'album'>>>;
}

export type BatchImageFetchContext =
  | 'article-banner-images'
  | 'album-covers'
  | 'url-expiration';
