export enum ModalButtonClassTypes {
  DEFAULT = 'lcc-default-button',
  CONFIRM_BLUE = 'lcc-primary-button',
  CONFIRM_RED = 'lcc-warning-button',
  CONFIRM_GREEN = 'lcc-success-button',
}

export type ModalButtonClass =
  | ModalButtonClassTypes.DEFAULT
  | ModalButtonClassTypes.CONFIRM_BLUE
  | ModalButtonClassTypes.CONFIRM_GREEN
  | ModalButtonClassTypes.CONFIRM_RED;
