import { ModalButton } from './modal-button.model';

export interface ModalContent {
  title: string;
  body: string;
  buttons: ModalButton[];
}
