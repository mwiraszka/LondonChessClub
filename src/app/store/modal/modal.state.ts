import type { Modal, ModalButtonActionTypesType } from '@app/types';

export interface ModalState {
  modal: Modal | null;
  selection: ModalButtonActionTypesType | null;
}

export const initialState: ModalState = {
  modal: null,
  selection: null,
};
