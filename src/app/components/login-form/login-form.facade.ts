import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthActions } from '@app/store/auth';
import { LoginRequest } from '@app/types';

@Injectable()
export class LoginFormFacade {
  constructor(private store: Store) {}

  onLogin(request: LoginRequest) {
    this.store.dispatch(AuthActions.loginRequested({ request }));
  }

  onForgotPassword() {
    this.store.dispatch(AuthActions.forgotPasswordSelected());
  }
}
