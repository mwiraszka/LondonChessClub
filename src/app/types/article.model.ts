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

export interface ArticleFormData {
  title: string;
  body: string;
  imageId: Id | null;
  isSticky: boolean;
}

export const newArticleFormTemplate: ArticleFormData = {
  title: '',
  body: '',
  imageId: null,
  isSticky: false,
};
