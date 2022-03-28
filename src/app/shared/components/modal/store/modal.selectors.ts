import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatures } from '@app/shared/types';

import { ModalState } from '../types/modal.state';

export const modalFeatureSelector = createFeatureSelector<ModalState>(
  AppStoreFeatures.MODAL
);

export const isOpen = createSelector(modalFeatureSelector, (state) => state.isOpen);

export const content = createSelector(modalFeatureSelector, (state) => state.content);

export const actionSelected = createSelector(
  modalFeatureSelector,
  (state) => state.actionSelected
);
