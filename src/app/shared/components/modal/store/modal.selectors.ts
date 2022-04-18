import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { ModalState } from '../types/modal.state';

export const modalFeatureSelector = createFeatureSelector<ModalState>(
  AppStoreFeatures.MODAL
);

export const modal = createSelector(modalFeatureSelector, (state) => state.modal);
export const isOpen = createSelector(modalFeatureSelector, (state) => !!state.modal);
export const selection = createSelector(modalFeatureSelector, (state) => state.selection);
