import { ArticlesState } from '@app/store/articles/articles.state';
import { AuthState } from '@app/store/auth/auth.state';
import { EventsState } from '@app/store/events/events.state';
import { MembersState } from '@app/store/members/members.state';
import { ModalState } from '@app/store/modal/modal.state';
import { NavState } from '@app/store/nav/nav.state';
import { ToasterState } from '@app/store/toaster/toaster.state';
import { UserSettingsState } from '@app/store/user-settings/user-settings.state';

export interface AppState {
  articlesState: ArticlesState;
  authState: AuthState;
  eventsState: EventsState;
  membersState: MembersState;
  modalState: ModalState;
  navState: NavState;
  toasterState: ToasterState;
  userSettingsState: UserSettingsState;
}
