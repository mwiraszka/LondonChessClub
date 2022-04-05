export enum AlertAction {
  REGISTER = 'register',
  VOTE = 'vote',
  CLOSE = 'close',
}

export type AlertActionType = AlertAction.REGISTER | AlertAction.VOTE | AlertAction.CLOSE;
