import { ModalButtonActionTypesType } from './modal-button.model';
import { Modal } from './modal.model';

export interface ModalState {
  modal?: Modal;
  selection?: ModalButtonActionTypesType;
}
