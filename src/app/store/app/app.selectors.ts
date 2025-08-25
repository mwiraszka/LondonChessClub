import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { EventsSelectors } from '@app/store/events';
import { ImagesSelectors } from '@app/store/images';
import { MembersSelectors } from '@app/store/members';

import { AppState } from './app.reducer';

export const selectAppState = createFeatureSelector<AppState>('appState');

export const selectIsLoading = createSelector(
  ArticlesSelectors.selectCallState,
  AuthSelectors.selectCallState,
  EventsSelectors.selectCallState,
  ImagesSelectors.selectCallState,
  MembersSelectors.selectCallState,
  (
    articlesCallState,
    authCallState,
    eventsCallState,
    imagesCallState,
    membersCallState,
  ) => {
    return [
      articlesCallState,
      authCallState,
      eventsCallState,
      imagesCallState,
      membersCallState,
    ].some(callState => callState.status === 'loading');
  },
);

export const selectIsDarkMode = createSelector(selectAppState, state => state.isDarkMode);

export const selectIsSafeMode = createSelector(selectAppState, state => state.isSafeMode);

export const selectShowUpcomingEventBanner = createSelector(
  selectAppState,
  state => state.showUpcomingEventBanner,
);

export const selectBannerLastCleared = createSelector(
  selectAppState,
  state => state.bannerLastCleared,
);
