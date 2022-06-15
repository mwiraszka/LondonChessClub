export interface Article {
  id: string | undefined;
  title: string;
  subtitle: string;
  headerImageUrl: string;
  authorId: string;
  dateCreated: string;
  dateEdited: string;
  body: string;
}

export const newArticleFormTemplate: Article = {
  id: undefined,
  title: '',
  subtitle: '',
  headerImageUrl: '',
  authorId: 'fake-author-id',
  dateCreated: new Date().toISOString().substring(0, 10),
  dateEdited: '',
  body: '',
};
