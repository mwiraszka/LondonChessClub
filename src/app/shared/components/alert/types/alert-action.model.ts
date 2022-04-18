export enum AlertAction {
  REGISTER = 'Register',
  VOTE = 'Vote',
  CLOSE = 'Close',
}

export type AlertActionType = AlertAction.REGISTER | AlertAction.VOTE | AlertAction.CLOSE;
