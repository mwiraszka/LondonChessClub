export interface Alert {
  message: string;
  action: AlertAction;
}

export enum AlertAction {
  SEE_SCHEDULE = 'See schedule',
  REGISTER = 'Register',
  VOTE = 'Vote',
  CLOSE = 'Close',
}
