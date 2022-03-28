import { createReducer, on, Action } from '@ngrx/store';

import * as ModalActions from './modal.actions';
import { ModalState } from '../types/modal.state';

const initialState: ModalState = {
  isOpen: false,
  content: null,
  actionSelected: null,
};

const modalReducer = createReducer(
  initialState,
  on(ModalActions.modalCreated, (state, action) => ({
    ...state,
    isOpen: true,
    content: action.content,
    actionSelected: null,
  })),
  on(ModalActions.selectionMade, (state, action) => ({
    ...state,
    isOpen: false,
    content: null,
    actionSelected: action.action,
  }))
);

export function reducer(state: ModalState, action: Action) {
  return modalReducer(state, action);
}
