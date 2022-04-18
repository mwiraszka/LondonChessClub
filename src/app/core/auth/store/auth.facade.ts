import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoginRequestData } from '../types/login-request-data.model';
import { SignUpRequestData } from '../types/sign-up-request-data.model';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';

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

  onLogin(loginRequestData: LoginRequestData) {
    this.store.dispatch(AuthActions.loginRequested({ loginRequestData }));
  }

  onSignUp(signUpRequestData: SignUpRequestData) {
    this.store.dispatch(AuthActions.signUpRequested({ signUpRequestData }));
  }

  constructor(private store: Store) {}
}
