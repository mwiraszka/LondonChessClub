import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types/app-store-features.model';

import { NavState } from './nav.state';

export const navFeatureSelector = createFeatureSelector<NavState>(
  AppStoreFeatureTypes.NAV
);

export const isDropdownOpen = createSelector(
  navFeatureSelector,
  (state) => state.isDropdownOpen
);
