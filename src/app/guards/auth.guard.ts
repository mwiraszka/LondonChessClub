import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import type { NavPath } from '@app/models';
import { AuthSelectors } from '@app/store/auth';
import { selectCurrentRoute } from '@app/store/nav/nav.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsAdmin).pipe(
      combineLatestWith(this.store.select(selectCurrentRoute)),
      map(([isAdmin, currentRoute]) => {
        if (isAdmin) {
          return true;
        }

        let redirectPath: NavPath;

        switch (currentRoute.routeConfig.path) {
          case 'event/edit/:event_id':
          case 'event/add':
            redirectPath = 'schedule';
            break;
          case 'article/view/:article_id':
          case 'article/edit/:article_id':
          case 'article/add':
            redirectPath = 'news';
            break;
          case 'member/edit/:member_id':
          case 'member/add':
            redirectPath = 'members';
            break;
          default:
            redirectPath = '';
        }

        this.router.navigate([redirectPath]);
        return false;
      }),
    );
  }
}
