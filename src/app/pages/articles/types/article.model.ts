export interface Article {
  id: string | undefined;
  title: string;
  subtitle: string;
  headerImage: File | string;
  authorId: string;
  dateCreated: string;
  dateEdited: string;
  body: string;
}

export const newArticleFormTemplate: Article = {
  id: undefined,
  title: '',
  subtitle: '',
  headerImage: '',
  authorId: 'fake-author-id',
  dateCreated: new Date().toISOString().substring(0, 10),
  dateEdited: '',
  body: '',
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: undefined,
    title: 'Article title 1',
    subtitle: 'Subtitle 1',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-05-22',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
  {
    id: undefined,
    title: 'Article title 2',
    subtitle: 'Subtitle 2',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-05-22',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
  {
    id: undefined,
    title: 'Article title 3',
    subtitle: 'Subtitle 3',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-05-22',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
  {
    id: undefined,
    title: 'Article title 4',
    subtitle: 'Subtitle 4',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-05-22',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
  {
    id: undefined,
    title: 'Article title 5',
    subtitle: 'Subtitle 5',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-05-22',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
  {
    id: undefined,
    title: 'Article title 6',
    subtitle: 'Subtitle 6',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-05-22',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
  {
    id: undefined,
    title: 'Article title 7',
    subtitle: 'Subtitle 7',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-04-23',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
  {
    id: undefined,
    title: 'Article title 8',
    subtitle: 'Subtitle 8',
    headerImage: '',
    authorId: 'fake-author-id',
    dateCreated: new Date().toISOString().substring(0, 10),
    dateEdited: '2022-05-27',
    body: 'Doiwi fowi oweif woefi woefi wofie oioinoom owefijw owefiw oefu woew. Friwief oewfiwf oiwef.',
  },
];
