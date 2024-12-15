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

export const newArticleFormTemplate: Article = {
  id: null,
  title: '',
  body: '',
  imageId: null,
  imageUrl: null,
  thumbnailImageUrl: null,
  isSticky: false,
  modificationInfo: null,
};
