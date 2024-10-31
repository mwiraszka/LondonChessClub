import { type Article, ControlModes } from '@app/types';

export interface ArticlesState {
  articles: Article[];
  selectedArticle: Article | null;
  formArticle: Article | null;
  controlMode: ControlModes;
}

export const initialState: ArticlesState = {
  articles: [],
  selectedArticle: null,
  formArticle: null,
  controlMode: ControlModes.VIEW,
};
