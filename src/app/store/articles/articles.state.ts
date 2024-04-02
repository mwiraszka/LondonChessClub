import { type Article, newArticleFormTemplate } from '@app/types';

export interface ArticlesState {
  articles: Article[];
  selectedArticle: Article | null;
  articleCurrently: Article;
  isEditMode: boolean;
  sectionToScrollTo: string | null;
}

export const initialState: ArticlesState = {
  articles: [],
  selectedArticle: null,
  articleCurrently: newArticleFormTemplate,
  isEditMode: false,
  sectionToScrollTo: null,
};
