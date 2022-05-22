import { createReducer, on, Action } from '@ngrx/store';

import * as ModalActions from './modal.actions';
import { ModalState } from '../types/modal.state';

const initialState: ModalState = {
  modal: null,
  selection: null,
};

const modalReducer = createReducer(
  initialState,
  on(ModalActions.modalOpened, (state, action) => ({
    ...state,
    modal: action.modal,
  })),
  on(ModalActions.modalClosed, () => initialState),
  on(ModalActions.selectionMade, (state, action) => ({
    ...state,
    modal: null,
    selection: action.action,
  }))
);

export function reducer(state: ModalState, action: Action) {
  return modalReducer(state, action);
}
