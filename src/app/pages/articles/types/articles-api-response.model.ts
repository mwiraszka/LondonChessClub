import { Article } from './article.model';

export interface ArticlesApiResponse {
  statusCode: number;
  errorMessage?: string;
  payload?: {
    allArticles?: Article[];
    article?: Article;
    addedArticle?: Article;
  };
}
