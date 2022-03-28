import { createSelector } from '@ngrx/store';

import { ArticleEditorSelectors } from '@app/pages/articles';
import { MemberEditorSelectors } from '@app/pages/members';

export const hasUnsavedChanges = createSelector(
  ArticleEditorSelectors.hasUnsavedChanges,
  MemberEditorSelectors.hasUnsavedChanges,
  (isArticleUnsaved, isMemberUnsaved) => {
    return isArticleUnsaved || isMemberUnsaved;
  }
);
