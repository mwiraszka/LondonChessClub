import { FormControl } from '@angular/forms';

import { Id, IsoDate, Url } from './core.model';
import { Image } from './image.model';
import type { ModificationInfo } from './modification-info.model';

export interface Article {
  id: Id;
  title: string;
  body: string;
  bannerImageId: Id | null;
  bookmarkDate: IsoDate | null;
  modificationInfo: ModificationInfo;
}

export type EditableArticle = Article & { formData: ArticleFormData | null };

export type ArticleFormData = Pick<Article, 'title' | 'body' | 'bannerImageId'> &
  Pick<Image, 'caption' & { newBannerImageDataUrl: Url | null }>;

export type ArticleFormGroup = {
  [Property in keyof ArticleFormData]: FormControl<ArticleFormData[Property]>;
};
