import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthActions } from '@app/core/auth';
import { LoginRequest } from '@app/shared/types';

@Injectable()
export class LoginScreenFacade {
  constructor(private store: Store) {}

  onLogin(loginRequest: LoginRequest) {
    this.store.dispatch(AuthActions.loginRequested({ loginRequest }));
  }

  onDontHaveAccount() {
    this.store.dispatch(AuthActions.dontHaveAccountSelected());
  }

  onForgotPassword() {
    this.store.dispatch(AuthActions.forgotPasswordSelected());
  }
}
