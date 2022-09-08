import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthActions } from '@app/store/auth';
import { SignUpRequest } from '@app/types';

@Injectable()
export class SignUpScreenFacade {
  constructor(private store: Store) {}

  onSignUp(request: SignUpRequest) {
    // this.store.dispatch(AuthActions.signUpRequested({ request }));
    console.error('User sign up functionality temporarily disabled');
  }
}
