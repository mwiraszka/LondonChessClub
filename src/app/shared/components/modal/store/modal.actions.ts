import { createAction, props } from '@ngrx/store';

import { ModalButtonAction } from '../types/modal-button.model';
import { Modal } from '../types/modal.model';

enum ModalActionTypes {
  MODAL_CREATED = '[Modal] Modal created',
  SELECTION_MADE = '[Modal] Selection made',
}

export const modalCreated = createAction(
  ModalActionTypes.MODAL_CREATED,
  props<{ modal: Modal }>()
);

export const selectionMade = createAction(
  ModalActionTypes.SELECTION_MADE,
  props<{ action: ModalButtonAction }>()
);
