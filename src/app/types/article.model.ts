import { FormControl } from '@angular/forms';

import { Id, Url } from './core.model';
import type { ModificationInfo } from './modification-info.model';

export interface Article {
  id: Id | null;
  title: string;
  body: string;
  imageId: Id | null;
  imageUrl: Url | null;
  thumbnailImageUrl: Url | null;
  isSticky: boolean;
  modificationInfo: ModificationInfo | null;
}

export type ArticleFormData = Omit<
  Article,
  'id' | 'imageUrl' | 'thumbnailImageUrl' | 'modificationInfo'
>;

export type ArticleFormGroup<ArticleFormData> = {
  [Property in keyof ArticleFormData]: FormControl<ArticleFormData[Property]>;
};

export const newArticleFormTemplate: ArticleFormData = {
  title: '',
  body: '',
  imageId: null,
  isSticky: false,
};
