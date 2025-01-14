import type { Article, ArticleFormData, ControlMode } from '@app/models';

export interface ArticlesState {
  articles: Article[];
  article: Article | null;
  articleFormData: ArticleFormData | null;
  controlMode: ControlMode | null;
}

export const initialState: ArticlesState = {
  articles: [],
  article: null,
  articleFormData: null,
  controlMode: null,
};
