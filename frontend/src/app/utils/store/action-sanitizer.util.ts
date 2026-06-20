import { Action } from '@ngrx/store';

import { AuthActions } from '@app/store/auth';

interface GenericAction extends Action {
  [key: string]: unknown;
}

/**
 * Sanitize the action by replacing sensitive props if it includes any.
 */
export function actionSanitizer(action: Action): GenericAction {
  const shruggy = '¯\\_(ツ)_/¯';

  switch (action.type) {
    case AuthActions.loginRequested.type:
    case AuthActions.passwordChangeRequested.type:
      return { ...action, password: shruggy };
    default:
      return { ...action };
  }
}
