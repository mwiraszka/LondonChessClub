export interface Article {
  id: string | undefined;
  title: string;
  subtitle: string;
  dateCreated: string;
  dateEdited: string;
  body: string;
}

export const newArticleFormTemplate: Article = {
  id: undefined,
  title: '',
  subtitle: '',
  dateCreated: new Date().toLocaleDateString(),
  dateEdited: '',
  body: '',
};
