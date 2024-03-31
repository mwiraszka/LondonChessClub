import { Action } from '@ngrx/store';

import { AuthActions } from '@app/store/auth';

/**
 * Sanitizes the action by replacing sensitive props if it includes any;
 * otherwise returns the same action
 *
 * @param {Action} action
 *
 * @returns {Action}
 */
export function actionSanitizer(action: Action): Action {
  const shruggy = '¯\\_(ツ)_/¯';
  if (
    action.type === AuthActions.loginRequested.type ||
    action.type === AuthActions.passwordChangeRequested.type
  ) {
    return {
      ...action,
      request: shruggy,
    } as Action;
  }

  if (action.type === AuthActions.passwordChangeSucceeded.type) {
    return {
      ...action,
      newPassword: shruggy,
    } as Action;
  }

  return action;
}
