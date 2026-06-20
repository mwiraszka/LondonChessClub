import { Store } from '@ngrx/store';
import { startCase } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { AuthSelectors } from '@app/store/auth';
import { NavActions } from '@app/store/nav';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsAdmin).pipe(
      map(isAdmin => {
        if (isAdmin) {
          return true;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [, entity, action] = ((route as any)._routerState?.url ?? '').split('/');

        const pageHeading = ['add', 'edit'].includes(action)
          ? startCase(`${action} ${entity}`)
          : '';

        this.store.dispatch(NavActions.pageAccessDenied({ pageHeading }));
        return false;
      }),
    );
  }
}
