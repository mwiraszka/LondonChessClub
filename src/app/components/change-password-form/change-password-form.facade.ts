import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { AuthActions, AuthSelectors } from '@app/store/auth';
import { PasswordChangeRequest } from '@app/types';

@Injectable()
export class ChangePasswordFormFacade {
  userHasCode$ = this.store.select(AuthSelectors.userHasCode);

  constructor(private store: Store) {}

  onSubmit(request: PasswordChangeRequest): void {
    this.userHasCode$
      .pipe(
        map((userHasCode) => {
          if (userHasCode) {
            this.store.dispatch(AuthActions.passwordChangeRequested({ request }));
          } else {
            this.store.dispatch(
              AuthActions.codeForPasswordChangeRequested({ email: request.email })
            );
          }
        }),
        first()
      )
      .subscribe();
  }
}
