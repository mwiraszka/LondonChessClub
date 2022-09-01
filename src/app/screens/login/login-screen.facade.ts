import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthActions } from '@app/store/auth';
import { LoginRequest } from '@app/types';

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
