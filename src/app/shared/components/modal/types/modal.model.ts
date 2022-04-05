import { ModalButton } from './modal-button.model';

export interface Modal {
  title: string;
  body: string;
  buttons: ModalButton[];
}
