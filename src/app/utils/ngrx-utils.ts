import { Action } from '@ngrx/store';

import { AuthActions } from '@app/store/auth';

/**
 * Sanitizes the action by replacing sensitive props if it includes any;
 * otherwise returns the same action (id param required for sanitizer for some reason)
 *
 * @param {Action} action
 * @param {number} id
 *
 * @returns {Action}
 */
export function actionSanitizer(action: Action, id: number): Action {
  const shruggy = `¯\\_(ツ)_/¯ ${id}`;
  if (
    action.type === AuthActions.loginRequested.type ||
    action.type === AuthActions.passwordChangeRequested.type ||
    action.type === AuthActions.newPasswordChallengeRequested.type
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
