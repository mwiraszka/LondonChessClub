export interface DropdownAction {
  text: string;
  actionType?: DropdownActionTypes;
}

export enum DropdownActionTypes {
  LOG_OUT,
  RESEND_VALIDATION_EMAIL,
}
