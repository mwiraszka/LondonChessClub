import { ToastTypes } from '@app/shared/components/toast';

export interface Toast {
  title: string;
  message: string;
  type: ToastTypes.SUCCESS | ToastTypes.WARNING | ToastTypes.INFO;
}
