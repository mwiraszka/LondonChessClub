import { Article } from '../../../types/article.model';

export interface ArticleGridState {
  articles: Article[];
  selectedArticle: Article | null;
  isLoading: boolean;
}
