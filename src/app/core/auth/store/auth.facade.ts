import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import { LoginRequest } from '../types/login-request.model';
import { SignUpRequest } from '../types/sign-up-request.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  user$ = this.store.select(AuthSelectors.user);

  onAlreadyHaveAccount() {
    this.store.dispatch(AuthActions.alreadyHaveAccountSelected());
  }

  onDontHaveAccount() {
    this.store.dispatch(AuthActions.dontHaveAccountSelected());
  }

  onForgotPassword() {
    this.store.dispatch(AuthActions.forgotPasswordSelected());
  }

  onLogin(loginRequest: LoginRequest) {
    this.store.dispatch(AuthActions.loginRequested({ loginRequest }));
  }

  onSignUp(signUpRequest: SignUpRequest) {
    this.store.dispatch(AuthActions.signUpRequested({ signUpRequest }));
  }

  constructor(private store: Store) {}
}
