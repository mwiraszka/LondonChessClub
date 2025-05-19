import { FormControl } from '@angular/forms';

import type { Id, IsoDate } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Article {
  id: Id;
  title: string;
  body: string;
  bannerImageId: Id | null;
  bookmarkDate: IsoDate | null;
  modificationInfo: ModificationInfo;
}

export type EditableArticle = Article & { formData: ArticleFormData };

export type ArticleFormData = Pick<Article, 'title' | 'body' | 'bannerImageId'>;

export type ArticleFormGroup = {
  [Property in keyof ArticleFormData]: FormControl<ArticleFormData[Property]>;
};
