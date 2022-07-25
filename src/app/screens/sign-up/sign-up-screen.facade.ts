import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthActions } from '@app/core/auth';
import { SignUpRequest } from '@app/shared/types';

@Injectable()
export class SignUpScreenFacade {
  constructor(private store: Store) {}

  onAlreadyHaveAccount() {
    this.store.dispatch(AuthActions.alreadyHaveAccountSelected());
  }

  onSignUp(signUpRequest: SignUpRequest) {
    this.store.dispatch(AuthActions.signUpRequested({ signUpRequest }));
  }
}
