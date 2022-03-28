import { ModalButtonAction } from './modal-button-action.model';
import { ModalContent } from './modal-content.model';

export interface ModalState {
  isOpen: boolean;
  content: ModalContent | null;
  actionSelected: ModalButtonAction | null;
}
