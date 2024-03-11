import { Article, newArticleFormTemplate } from '@app/types';

export interface ArticlesState {
  articles: Article[];
  selectedArticle: Article | null;
  articleBeforeEdit: Article;
  articleCurrently: Article;
  isEditMode: boolean;
  sectionToScrollTo: string | null;
}

export const initialState: ArticlesState = {
  articles: [],
  selectedArticle: null,
  articleBeforeEdit: newArticleFormTemplate,
  articleCurrently: newArticleFormTemplate,
  isEditMode: false,
  sectionToScrollTo: null,
};
