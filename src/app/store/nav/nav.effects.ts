import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { MembersActions } from '@app/store/members';
import { ScheduleActions } from '@app/store/schedule';
import { NavPathTypes } from '@app/types';

import * as NavActions from './nav.actions';

@Injectable()
export class NavEffects {
  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.navigationRequested),
        tap(({ path }) => {
          if (path.includes('www.') || path.includes('http')) {
            window.open(path, '_blank');
          } else {
            this.router.navigate([path]);
          }
        }),
      ),
    { dispatch: false },
  );

  handleArticleViewRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/article/view/')),
      concatLatestFrom(({ payload }) => [
        this.store.select(
          ArticlesSelectors.articleById(payload.event.url.split('/article/view/')[1]),
        ),
      ]),
      map(([, article]) =>
        article
          ? ArticlesActions.articleSelected({ article })
          : NavActions.navigationRequested({ path: NavPathTypes.NEWS }),
      ),
    ),
  );

  handleLogoutRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url === '/logout'),
      concatLatestFrom(() => [this.store.select(AuthSelectors.user)]),
      filter(([, user]) => !!user),
      map(() => AuthActions.logoutRequested()),
    ),
  );

  navigateHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSucceeded, AuthActions.passwordChangeSucceeded),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.HOME })),
    ),
  );

  navigateToMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MembersActions.cancelSelected,
        MembersActions.addMemberSucceeded,
        MembersActions.updateMemberSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.MEMBERS })),
    ),
  );

  navigateToMemberEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.editMemberSelected),
      map(({ memberToEdit }) =>
        NavActions.navigationRequested({
          path: NavPathTypes.HOME + '/' + memberToEdit.id,
        }),
      ),
    ),
  );

  navigateToSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ScheduleActions.cancelSelected,
        ScheduleActions.addEventSucceeded,
        ScheduleActions.updateEventSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.SCHEDULE })),
    ),
  );

  navigateToEventEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.editEventSelected),
      map(({ eventToEdit }) =>
        NavActions.navigationRequested({
          path: NavPathTypes.SCHEDULE + '/' + eventToEdit.id,
        }),
      ),
    ),
  );

  // TODO: check activated route when deleteArticleSucceeded action dispatched
  // and only navigate to News screen if coming from the Article Viewer screen
  navigateToNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.cancelSelected,
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
        ArticlesActions.deleteArticleSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.NEWS })),
    ),
  );

  navigateToArticleEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.editArticleSelected),
      map(({ articleToEdit }) =>
        NavActions.navigationRequested({
          path: NavPathTypes.NEWS + '/' + articleToEdit.id,
        }),
      ),
    ),
  );

  constructor(private actions$: Actions, private router: Router, private store: Store) {}
}
