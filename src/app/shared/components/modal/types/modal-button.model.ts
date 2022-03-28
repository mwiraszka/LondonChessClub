import { ModalButtonAction } from './modal-button-action.model';
import { ModalButtonClass } from './modal-button-class.model';

export interface ModalButton {
  text: string;
  class: ModalButtonClass;
  action: ModalButtonAction;
}
