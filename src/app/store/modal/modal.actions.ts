import { createAction, props } from '@ngrx/store';

import { Modal, ModalButtonActionTypes } from '@app/types';

enum ModalActionTypes {
  MODAL_OPENED = '[Modal] Modal opened',
  MODAL_CLOSED = '[Modal] Modal closed',
  SELECTION_MADE = '[Modal] Selection made',
  LEAVE_WITH_UNSAVED_CHANGES_REQUESTED = '[Modal] Leave with unsaved changes requested',
}

export const modalOpened = createAction(
  ModalActionTypes.MODAL_OPENED,
  props<{ modal: Modal }>()
);

export const modalClosed = createAction(ModalActionTypes.MODAL_CLOSED);

export const selectionMade = createAction(
  ModalActionTypes.SELECTION_MADE,
  props<{ action: ModalButtonActionTypes }>()
);

export const leaveWithUnsavedChangesRequested = createAction(
  ModalActionTypes.LEAVE_WITH_UNSAVED_CHANGES_REQUESTED
);
