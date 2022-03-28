import { Article } from '../../types/article.model';

export interface ArticleEditorState {
  articleBeforeEdit: Article;
  articleAfterEdit?: Article;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
}
