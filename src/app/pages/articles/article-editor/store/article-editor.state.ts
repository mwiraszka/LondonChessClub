import { Article } from '../../types/article.model';

export interface ArticleEditorState {
  articleBeforeEdit: Article;
  articleCurrently: Article;
  isEditMode: boolean;
}
