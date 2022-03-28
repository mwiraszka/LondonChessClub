import { Article } from '../../types/article.model';

export interface ArticleListState {
  articles: Article[];
  selectedArticle: Article | null;
  isLoading: boolean;
}
