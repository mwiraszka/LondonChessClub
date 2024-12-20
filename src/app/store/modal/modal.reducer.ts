import { Action, createReducer, on } from '@ngrx/store';

import * as ModalActions from './modal.actions';
import { ModalState, initialState } from './modal.state';

const modalReducer = createReducer(
  initialState,

  on(
    ModalActions.modalOpened,
    (state, { modal }): ModalState => ({
      ...state,
      modal,
    }),
  ),

  on(ModalActions.modalClosed, (): ModalState => initialState),

  on(
    ModalActions.selectionMade,
    (state, { action }): ModalState => ({
      ...state,
      modal: null,
      selection: action,
    }),
  ),
);

export function reducer(state: ModalState, action: Action): ModalState {
  return modalReducer(state, action);
}
