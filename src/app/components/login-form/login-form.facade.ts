import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthActions } from '@app/store/auth';
import { LoginRequest } from '@app/types';

@Injectable()
export class LoginFormFacade {
  constructor(private readonly store: Store) {}

  onLogin(request: LoginRequest): void {
    this.store.dispatch(AuthActions.loginRequested({ request }));
  }
}
