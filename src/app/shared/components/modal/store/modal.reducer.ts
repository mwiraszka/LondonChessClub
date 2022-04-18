import { createReducer, on, Action } from '@ngrx/store';

import * as ModalActions from './modal.actions';
import { ModalState } from '../types/modal.state';

const initialState: ModalState = {
  modal: null,
  selection: null,
};

const modalReducer = createReducer(
  initialState,
  on(ModalActions.modalCreated, (state, action) => ({
    ...state,
    modal: action.modal,
    selection: null,
  })),
  on(ModalActions.selectionMade, (state, action) => ({
    ...state,
    modal: null,
    selection: action.action,
  }))
);

export function reducer(state: ModalState, action: Action) {
  return modalReducer(state, action);
}
