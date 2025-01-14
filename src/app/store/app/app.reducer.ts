import { createReducer, on } from '@ngrx/store';
import moment from 'moment-timezone';

import { ArticlesActions } from '@app/store/articles';
import { EventsActions } from '@app/store/events';
import { MembersActions } from '@app/store/members';

import * as AppActions from './app.actions';
import { AppState, initialState } from './app.state';

export const appReducer = createReducer(
  initialState,

  on(
    AppActions.themeToggled,
    (state): AppState => ({
      ...state,
      isDarkMode: !state.isDarkMode,
    }),
  ),

  on(
    AppActions.safeModeToggled,
    (state): AppState => ({
      ...state,
      isSafeMode: !state.isSafeMode,
    }),
  ),

  on(
    ArticlesActions.publishArticleRequested,
    ArticlesActions.updateArticleRequested,
    EventsActions.addEventRequested,
    EventsActions.updateEventRequested,
    MembersActions.addMemberRequested,
    MembersActions.updateMemberRequested,
    (state): AppState => ({
      ...state,
      isSubmitting: true,
    }),
  ),

  on(
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.publishArticleFailed,
    ArticlesActions.updateArticleSucceeded,
    ArticlesActions.updateArticleFailed,
    EventsActions.addEventSucceeded,
    EventsActions.addEventFailed,
    EventsActions.updateEventSucceeded,
    EventsActions.updateEventFailed,
    MembersActions.addMemberSucceeded,
    MembersActions.addMemberFailed,
    MembersActions.updateMemberSucceeded,
    MembersActions.updateMemberFailed,
    (state): AppState => ({
      ...state,
      isSubmitting: false,
    }),
  ),

  on(
    AppActions.upcomingEventBannerCleared,
    (state): AppState => ({
      ...state,
      showUpcomingEventBanner: false,
      bannerLastCleared: moment().toISOString(),
    }),
  ),

  on(
    AppActions.upcomingEventBannerReinstated,
    (state): AppState => ({
      ...state,
      showUpcomingEventBanner: true,
      bannerLastCleared: null,
    }),
  ),
);
