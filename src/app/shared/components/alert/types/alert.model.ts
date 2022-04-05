import { AlertAction } from './alert-action.model';

export interface Alert {
  message: string;
  action: AlertAction;
}
