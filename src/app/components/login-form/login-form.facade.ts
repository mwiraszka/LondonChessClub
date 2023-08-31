import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthActions } from '@app/store/auth';
import { LoginRequest } from '@app/types';

@Injectable()
export class LoginFormFacade {
  constructor(private store: Store) {}

  onLogin(request: LoginRequest): void {
    this.store.dispatch(AuthActions.loginRequested({ request }));
  }

  onForgotPassword(): void {
    this.store.dispatch(AuthActions.forgotPasswordSelected());
  }
}
