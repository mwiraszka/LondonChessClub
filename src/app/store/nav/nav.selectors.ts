import { getRouterSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';

import { NavState } from './nav.reducer';

export const selectNavState = createFeatureSelector<NavState>('navState');

export const selectPathHistory = createSelector(
  selectNavState,
  state => state?.pathHistory,
);

export const selectPreviousPath = createSelector(selectPathHistory, pathHistory =>
  pathHistory?.length && pathHistory.length > 0
    ? pathHistory[pathHistory.length - 1]
    : null,
);

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectRouteDataParam, // factory function to select a route data param
  selectUrl, // select the current url
  selectTitle, // select the title if available
} = getRouterSelectors();

export const selectNavViewModel = createSelector({
  user: AuthSelectors.selectUser,
  isDarkMode: AppSelectors.selectIsDarkMode,
  isSafeMode: AppSelectors.selectIsSafeMode,
});
