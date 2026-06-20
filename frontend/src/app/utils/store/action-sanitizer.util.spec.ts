import { AuthActions } from '@app/store/auth';

import { actionSanitizer } from './action-sanitizer.util';

describe('actionSanitizer', () => {
  it('should let unrelated actions through unchanged', () => {
    const action = AuthActions.logoutRequested({ sessionExpired: false });
    expect(actionSanitizer(action)).toStrictEqual(action);
  });

  it('should add request placeholder for loginRequested', () => {
    const action = AuthActions.loginRequested({
      email: 'user@example.com',
      password: 'secret',
    });

    expect(actionSanitizer(action)).toEqual({
      type: AuthActions.loginRequested.type,
      email: 'user@example.com',
      password: '¯\\_(ツ)_/¯',
    });
  });

  it('should add request placeholder for passwordChangeRequested', () => {
    const action = AuthActions.passwordChangeRequested({
      email: 'user@example.com',
      password: 'secret',
      code: '123456',
    });

    expect(actionSanitizer(action)).toEqual({
      type: AuthActions.passwordChangeRequested.type,
      email: 'user@example.com',
      password: '¯\\_(ツ)_/¯',
      code: '123456',
    });
  });
});
