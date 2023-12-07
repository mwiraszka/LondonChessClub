import { ModificationInfo } from '@app/types';

export interface Article {
  id: string | null;
  title: string;
  body: string;
  imageFile: File | null;
  imageId: string | null;
  imageUrl: string | null;
  thumbnailImageUrl: string | null;
  modificationInfo: ModificationInfo | null;
}

export const newArticleFormTemplate: Article = {
  id: null,
  title: '',
  body: '',
  imageFile: null,
  imageId: null,
  imageUrl: null,
  thumbnailImageUrl: null,
  modificationInfo: null,
};

// Backend representation of the type
export interface FlatArticle {
  id: string | null;
  title: string;
  body: string;
  imageFile: File | null;
  imageId: string | null;
  imageUrl: string | null;
  thumbnailImageUrl: string | null;
  dateCreated: string;
  createdBy: string;
  dateLastEdited: string;
  lastEditedBy: string;
}
