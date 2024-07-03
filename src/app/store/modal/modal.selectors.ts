import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';

import { ModalState } from './modal.state';

export const modalFeatureSelector = createFeatureSelector<ModalState>(
  AppStoreFeatureTypes.MODAL,
);

export const modal = createSelector(modalFeatureSelector, (state) => state.modal);
export const isOpen = createSelector(modalFeatureSelector, (state) => !!state.modal);
export const selection = createSelector(modalFeatureSelector, (state) => state.selection);
