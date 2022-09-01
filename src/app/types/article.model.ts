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
  dateCreated: new Date().toLocaleDateString(),
  dateEdited: '',
  body: '',
};

export const MOCK_ARTICLES: Article[] = [
  {
    ...newArticleFormTemplate,
    title: 'Mock Article 1 Title',
    subtitle: 'Mock Subtitle',
    body: 'goiwergiwjre weogiwjge wegoweigj wegowe giwegj weogijw egwoeigjw egow. woegijw egoweig w. woeigjw eogij SWoAEigw eglwe . wiejgwoeigjw egw.egi wegjwlegi...',
  },
  {
    ...newArticleFormTemplate,
    title: 'Mock Article 2 Title',
    subtitle: 'Mock Subtitle',
    body: 'goiwergiwjre weogiwjge wegoweigj wegowe giwegj weogijw egwoeigjw egow. woegijw egoweig w. woeigjw eogij SWoAEigw eglwe . wiejgwoeigjw egw.egi wegjwlegi...',
  },
  {
    ...newArticleFormTemplate,
    title: 'Mock Article 3 Title',
    subtitle: 'Mock Subtitle',
    body: 'goiwergiwjre weogiwjge wegoweigj wegowe giwegj weogijw egwoeigjw egow. woegijw egoweig w. woeigjw eogij SWoAEigw eglwe . wiejgwoeigjw egw.egi wegjwlegi...',
  },
  {
    ...newArticleFormTemplate,
    title: 'Mock Article 4 Title',
    subtitle: 'Mock Subtitle',
    body: 'goiwergiwjre weogiwjge wegoweigj wegowe giwegj weogijw egwoeigjw egow. woegijw egoweig w. woeigjw eogij SWoAEigw eglwe . wiejgwoeigjw egw.egi wegjwlegi...',
  },
];
