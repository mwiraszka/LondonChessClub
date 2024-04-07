import type { Article } from '@app/types';

export interface ArticlesState {
  articles: Article[];
  selectedArticle: Article | null;
  articleCurrently: Article | null;
  isEditMode: boolean | null;
  sectionToScrollTo: string | null;
}

export const initialState: ArticlesState = {
  articles: [],
  selectedArticle: null,
  articleCurrently: null,
  isEditMode: null,
  sectionToScrollTo: null,
};
