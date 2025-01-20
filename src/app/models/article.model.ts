import { FormControl } from '@angular/forms';

import { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Article {
  id: Id | null;
  title: string;
  body: string;
  imageId: Id | null;
  bookmarkDate: IsoDate | null;
  modificationInfo: ModificationInfo;
}

export type ArticleFormData = Omit<Article, 'id' | 'modificationInfo' | 'bookmarkDate'>;

export type ArticleFormGroup<ArticleFormData> = {
  [Property in keyof ArticleFormData]: FormControl<ArticleFormData[Property]>;
};
