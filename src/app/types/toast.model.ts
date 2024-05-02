export enum ToastTypes {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export interface Toast {
  title: string;
  message: string;
  type: ToastTypes;
}
