import { Article, newArticleFormTemplate } from '@app/types';

export interface ArticlesState {
  articles: Article[];
  selectedArticle: Article | null;
  isLoading: boolean;
  articleBeforeEdit: Article;
  articleCurrently: Article;
  isEditMode: boolean;
}

export const initialState: ArticlesState = {
  articles: [],
  selectedArticle: null,
  isLoading: false,
  articleBeforeEdit: newArticleFormTemplate,
  articleCurrently: newArticleFormTemplate,
  isEditMode: false,
};