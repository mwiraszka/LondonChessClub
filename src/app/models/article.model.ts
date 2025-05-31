import { FormControl } from '@angular/forms';

import type { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Article {
  id: Id;
  title: string;
  body: string;
  bannerImageId: Id;
  bookmarkDate: IsoDate | null;
  modificationInfo: ModificationInfo;
}

export const ARTICLE_FORM_DATA_PROPERTIES = ['title', 'body', 'bannerImageId'] as const;

export type ArticleFormData = Pick<
  Article,
  (typeof ARTICLE_FORM_DATA_PROPERTIES)[number]
>;

export type ArticleFormGroup = {
  [Property in keyof ArticleFormData]: FormControl<ArticleFormData[Property]>;
};
