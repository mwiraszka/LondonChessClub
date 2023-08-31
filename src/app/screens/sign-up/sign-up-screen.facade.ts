import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

// import { AuthActions } from '@app/store/auth';
import { SignUpRequest } from '@app/types';

@Injectable()
export class SignUpScreenFacade {
  constructor(private store: Store) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSignUp(request: SignUpRequest): void {
    // this.store.dispatch(AuthActions.signUpRequested({ request }));
    console.error('User sign up functionality temporarily disabled');
  }
}
