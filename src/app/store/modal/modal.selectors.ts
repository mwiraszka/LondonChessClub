import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { ModalState } from './modal.state';

export const modalFeatureSelector = createFeatureSelector<ModalState>(
  StoreFeatures.MODAL,
);

export const modal = createSelector(modalFeatureSelector, state => state.modal);
export const isOpen = createSelector(modalFeatureSelector, state => !!state.modal);
export const selection = createSelector(modalFeatureSelector, state => state.selection);
