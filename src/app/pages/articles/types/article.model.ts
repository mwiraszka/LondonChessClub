export interface Article {
  _id: string | undefined;
  title: string;
  subtitle: string;
  headerImage: File | string;
  authorUserId: string;
  dateCreated: string;
  dateEdited: string;
  body: string;
}

export const newArticleFormTemplate: Article = {
  _id: undefined,
  title: '',
  subtitle: '',
  headerImage: '',
  authorUserId: 'Admin',
  dateCreated: new Date().toISOString().substring(0, 10),
  dateEdited: '',
  body: '',
};
