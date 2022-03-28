import { createFeatureSelector } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types/app-store-features.model';

import { NavState } from '../types/nav.state';

export const navFeatureSelector = createFeatureSelector<NavState>(AppStoreFeatures.NAV);
