import { type Article, ControlModes } from '@app/types';

export interface ArticlesState {
  articles: Article[];
  setArticle: Article | null;
  formArticle: Article | null;
  controlMode: ControlModes | null;
}

export const initialState: ArticlesState = {
  articles: [],
  setArticle: null,
  formArticle: null,
  controlMode: null,
};
