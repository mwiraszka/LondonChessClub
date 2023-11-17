export interface Article {
  id: string | null;
  title: string;
  body: string;
  imageFile: File | null;
  imageId: string | null;
  imageUrl: string | null;
  thumbnailImageUrl: string | null;
  dateCreated: string;
  dateEdited: string;
}

export const newArticleFormTemplate: Article = {
  id: null,
  title: '',
  body: '',
  imageFile: null,
  imageId: null,
  imageUrl: null,
  thumbnailImageUrl: null,
  dateCreated: new Date().toLocaleDateString(),
  dateEdited: new Date().toLocaleDateString(),
};
