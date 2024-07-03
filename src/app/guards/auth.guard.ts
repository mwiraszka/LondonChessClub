import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthSelectors } from '@app/store/auth';
import { selectCurrentRoute } from '@app/store/nav/nav.selectors';
import { NavPathTypes } from '@app/types';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.isAdmin).pipe(
      combineLatestWith(this.store.select(selectCurrentRoute)),
      map(([isAdmin, currentRoute]) => {
        if (isAdmin) {
          return true;
        }

        let redirectPath: NavPathTypes;
        switch (currentRoute.routeConfig.path) {
          case 'event/edit/:event_id':
          case 'event/add':
            redirectPath = NavPathTypes.SCHEDULE;
            break;
          case 'article/view/:article_id':
          case 'article/edit/:article_id':
          case 'article/add':
            redirectPath = NavPathTypes.NEWS;
            break;
          case 'member/edit/:member_id':
          case 'member/add':
            redirectPath = NavPathTypes.MEMBERS;
            break;
          default:
            redirectPath = NavPathTypes.HOME;
        }

        this.router.navigate([redirectPath]);
        return false;
      }),
    );
  }
}
