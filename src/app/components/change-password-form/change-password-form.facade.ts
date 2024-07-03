import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthActions, AuthSelectors } from '@app/store/auth';
import type {
  LoginRequest,
  PasswordChangeFormData,
  PasswordChangeRequest,
} from '@app/types';

@Injectable()
export class ChangePasswordFormFacade {
  tempInitialPassword$ = this.store.select(AuthSelectors.tempInitialPassword);
  userHasCode$ = this.store.select(AuthSelectors.userHasCode);
  user$ = this.store.select(AuthSelectors.user);

  constructor(private readonly store: Store) {}

  onSubmit(formData: PasswordChangeFormData): void {
    this.userHasCode$
      .pipe(
        combineLatestWith(this.user$, this.tempInitialPassword$),
        map(([userHasCode, user, tempInitialPassword]) => {
          if (user && !user?.isVerified && tempInitialPassword) {
            const request: LoginRequest = {
              email: user.email,
              password: formData.newPassword,
              tempInitialPassword,
            };
            this.store.dispatch(AuthActions.loginRequested({ request }));
          } else if (userHasCode) {
            const request: PasswordChangeRequest = {
              email: formData.email,
              newPassword: formData.newPassword,
              code: formData.code!,
            };
            this.store.dispatch(AuthActions.passwordChangeRequested({ request }));
          } else {
            this.store.dispatch(
              AuthActions.codeForPasswordChangeRequested({ email: formData.email })
            );
          }
        }),
        first()
      )
      .subscribe();
  }

  onRequestNewCode(): void {
    this.store.dispatch(AuthActions.requestNewCodeSelected());
  }
}
