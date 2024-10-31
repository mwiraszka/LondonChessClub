import { getRouterSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { NavState } from './nav.state';

export const navFeatureSelector = createFeatureSelector<NavState>(StoreFeatures.NAV);

export const pathHistory = createSelector(
  navFeatureSelector,
  state => state?.pathHistory,
);
export const previousPath = createSelector(pathHistory, pathHistory =>
  pathHistory ? pathHistory[pathHistory.length - 1] : null,
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
