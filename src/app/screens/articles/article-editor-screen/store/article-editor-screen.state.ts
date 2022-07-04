import { Article } from '../../../../shared/types/article.model';

export interface ArticleEditorScreenState {
  articleBeforeEdit: Article;
  articleCurrently: Article;
  isEditMode: boolean;
}
