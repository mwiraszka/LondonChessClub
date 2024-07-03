import { Action, createReducer, on } from '@ngrx/store';

import * as ModalActions from './modal.actions';
import { ModalState, initialState } from './modal.state';

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

export function reducer(state: ModalState, action: Action): ModalState {
  return modalReducer(state, action);
}
