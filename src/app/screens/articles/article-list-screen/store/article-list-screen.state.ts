import { Article } from '../../types/article.model';

export interface ArticleListScreenState {
  articles: Article[];
  selectedArticle: Article | null;
  isLoading: boolean;
}
