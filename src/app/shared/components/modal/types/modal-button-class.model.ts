export enum ModalButtonClassTypes {
  DEFAULT = 'btn-info-outline',
  CONFIRM_BLUE = 'btn-info',
  CONFIRM_RED = 'btn-danger',
  CONFIRM_GREEN = 'btn-success',
}

export type ModalButtonClass =
  | ModalButtonClassTypes.DEFAULT
  | ModalButtonClassTypes.CONFIRM_BLUE
  | ModalButtonClassTypes.CONFIRM_GREEN
  | ModalButtonClassTypes.CONFIRM_RED;
