import { Modal, ModalButtonActionTypesType } from '@app/types';

export interface ModalState {
  modal?: Modal;
  selection?: ModalButtonActionTypesType;
}

export const initialState: ModalState = {
  modal: null,
  selection: null,
};
