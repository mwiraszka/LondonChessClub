import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthActions, SignUpRequest } from '@app/core/auth';

@Injectable({ providedIn: 'root' })
export class SignUpFacade {
  constructor(private store: Store) {}

  onAlreadyHaveAccount() {
    this.store.dispatch(AuthActions.alreadyHaveAccountSelected());
  }

  onSignUp(signUpRequest: SignUpRequest) {
    this.store.dispatch(AuthActions.signUpRequested({ signUpRequest }));
  }
}