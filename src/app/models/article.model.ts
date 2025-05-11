import { FormControl } from '@angular/forms';

import { Id, IsoDate } from './core.model';
import { Image } from './image.model';
import type { ModificationInfo } from './modification-info.model';

export interface Article {
  id: Id | null;
  title: string;
  body: string;
  image: Image | null;
  bookmarkDate: IsoDate | null;
  modificationInfo: ModificationInfo;
  formData: ArticleFormData | null;
}

export type ArticleFormData = Pick<Article, 'title' | 'body' | 'image'> & {
  imageTitle: string;
};

export type ArticleFormGroup = {
  [Property in keyof ArticleFormData]: FormControl<ArticleFormData[Property]>;
};
