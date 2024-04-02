import type { ModificationInfo } from '@app/types';

export interface Article {
  id: string | null;
  title: string;
  body: string;
  imageFile: File | null;
  imageId: string | null;
  imageUrl: string | null;
  thumbnailImageUrl: string | null;
  isSticky: boolean | string; // Stored as a string in DynamoDB
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
  isSticky: false,
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
  isSticky: boolean | string; // Stored as a string in DynamoDB
  dateCreated: string;
  createdBy: string;
  dateLastEdited: string;
  lastEditedBy: string;
}
