import { AuthState } from '@app/core/auth';
import { NavState } from '@app/core/nav';
import { ArticleEditorScreenState, ArticleListScreenState } from '@app/screens/articles';
import { MemberEditorScreenState, MemberListScreenState } from '@app/screens/members';
import { AlertState } from '@app/shared/components/alert';
import { ImageOverlayState } from '@app/shared/components/image-overlay';
import { ModalState } from '@app/shared/components/modal';
import { ToasterState } from '@app/shared/components/toaster';

export interface AppState {
  alertState: AlertState;
  articleEditorScreenState: ArticleEditorScreenState;
  articleListScreenState: ArticleListScreenState;
  authState: AuthState;
  imageOverlayState: ImageOverlayState;
  memberEditorScreenState: MemberEditorScreenState;
  memberListScreenState: MemberListScreenState;
  modalState: ModalState;
  navState: NavState;
  toasterState: ToasterState;
}
