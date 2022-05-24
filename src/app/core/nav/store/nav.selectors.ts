import { createFeatureSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/shared/types/app-store-features.model';

import { NavState } from '../types/nav.state';

export const navFeatureSelector = createFeatureSelector<NavState>(
  AppStoreFeatureTypes.NAV
);
