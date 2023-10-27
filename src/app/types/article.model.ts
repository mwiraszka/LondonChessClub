export interface Article {
  id: string | null;
  title: string;
  body: string;
  dateCreated: string;
  dateEdited: string;
  imageFile: File | null;
  imageId: string | null;
  imageUrl: string | null;
  thumbnailImageUrl: string | null;
}

export const newArticleFormTemplate: Article = {
  id: null,
  title: '',
  body: '',
  dateCreated: new Date().toLocaleDateString(),
  dateEdited: '',
  imageFile: null,
  imageId: null,
  imageUrl: null,
  thumbnailImageUrl: null,
};
