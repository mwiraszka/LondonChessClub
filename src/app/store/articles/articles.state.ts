import { type Article, ArticleFormData, ControlMode } from '@app/types';

export interface ArticlesState {
  articles: Article[];
  article: Article | null;
  articleFormData: ArticleFormData | null;
  isNewImageStored: boolean;
  controlMode: ControlMode | null;
}

export const initialState: ArticlesState = {
  articles: [],
  article: null,
  articleFormData: null,
  isNewImageStored: false,
  controlMode: null,
};
