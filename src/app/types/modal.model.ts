export interface Modal {
  title: string;
  body: string;
  confirmButtonText: string;
  confirmButtonType?: 'primary' | 'warning';
  cancelButtonText?: string;
}

export type ModalResult = 'confirm' | 'cancel';
