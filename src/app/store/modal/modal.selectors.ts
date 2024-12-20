import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { ModalState } from './modal.state';

export const selectModalState = createFeatureSelector<ModalState>(StoreFeatures.MODAL);

export const selectModal = createSelector(selectModalState, state => state.modal);
export const selectIsOpen = createSelector(selectModalState, state => !!state.modal);
export const selectSelection = createSelector(selectModalState, state => state.selection);
