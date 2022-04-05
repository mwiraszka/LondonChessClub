import { AuthState } from '@app/core/auth';
import { NavState } from '@app/core/nav';
import { ArticleEditorState, ArticleListState } from '@app/pages/articles';
import { MemberEditorState, MemberListState } from '@app/pages/members';
import { AlertState } from '@app/shared/components/alert';
import { ModalState } from '@app/shared/components/modal';
import { ToasterState } from '@app/shared/components/toaster';

export interface AppState {
  alertState: AlertState;
  articleEditorState: ArticleEditorState;
  articleListState: ArticleListState;
  authState: AuthState;
  memberEditorState: MemberEditorState;
  memberListState: MemberListState;
  modalState: ModalState;
  navState: NavState;
  toasterState: ToasterState;
}
