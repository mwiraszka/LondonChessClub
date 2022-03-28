import { NavState } from '@app/core/nav';
import { ArticleEditorState, ArticleListState } from '@app/pages/articles';
import { MemberEditorState, MemberListState } from '@app/pages/members';
import { ModalState } from '@app/shared/components/modal';
import { ToasterState } from '@app/shared/components/toaster';

export interface AppState {
  articleEditorState: ArticleEditorState;
  articleListState: ArticleListState;
  memberEditorState: MemberEditorState;
  memberListState: MemberListState;
  modalState: ModalState;
  navState: NavState;
  toasterState: ToasterState;
}
