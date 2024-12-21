import { type Article, ArticleFormData, ControlMode } from '@app/types';
import { generatePlaceholderArticles } from '@app/utils';

export interface ArticlesState {
  articles: Article[];
  article: Article | null;
  articleFormData: ArticleFormData | null;
  isNewImageStored: boolean;
  controlMode: ControlMode | null;
}

export const initialState: ArticlesState = {
  articles: generatePlaceholderArticles(20),
  article: null,
  articleFormData: null,
  isNewImageStored: false,
  controlMode: null,
};
