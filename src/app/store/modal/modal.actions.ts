import { createAction, props } from '@ngrx/store';

import type { Modal, ModalButtonActionTypes } from '@app/types';

export const modalOpened = createAction(
  '[Modal] Modal opened',
  props<{ modal: Modal }>(),
);

export const modalClosed = createAction('[Modal] Modal closed');

export const selectionMade = createAction(
  '[Modal] Selection made',
  props<{ action: ModalButtonActionTypes }>(),
);

export const leaveWithUnsavedChangesRequested = createAction(
  '[Modal] Leave with unsaved changes requested',
);
