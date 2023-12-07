import { ArticlesState } from '@app/store/articles/articles.state';
import { AuthState } from '@app/store/auth/auth.state';
import { ImageOverlayState } from '@app/store/image-overlay/image-overlay.state';
import { MembersState } from '@app/store/members/members.state';
import { ModalState } from '@app/store/modal/modal.state';
import { ScheduleState } from '@app/store/schedule/schedule.state';
import { ToasterState } from '@app/store/toaster/toaster.state';

export interface AppState {
  articlesState: ArticlesState;
  authState: AuthState;
  imageOverlayState: ImageOverlayState;
  membersState: MembersState;
  modalState: ModalState;
  scheduleState: ScheduleState;
  toasterState: ToasterState;
}
