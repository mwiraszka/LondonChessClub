import { AppState } from '@app/store/app/app.state';
import { ArticlesState } from '@app/store/articles/articles.state';
import { AuthState } from '@app/store/auth/auth.state';
import { EventsState } from '@app/store/events/events.state';
import { MembersState } from '@app/store/members/members.state';
import { NavState } from '@app/store/nav/nav.state';

export interface MetaState {
  appState: AppState;
  articlesState: ArticlesState;
  authState: AuthState;
  eventsState: EventsState;
  membersState: MembersState;
  navState: NavState;
}
