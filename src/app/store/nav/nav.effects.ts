import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
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

  handleArticleEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/article/edit/')),
      concatLatestFrom(({ payload }) => [
        this.store.select(
          ArticlesSelectors.articleById(payload.event.url.split('/article/edit/')[1]),
        ),
      ]),
      map(([, article]) =>
        article
          ? ArticlesActions.articleSelected({ article })
          : NavActions.navigationRequested({ path: NavPathTypes.NEWS }),
      ),
    ),
  );

  handleMemberEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/member/edit/')),
      concatLatestFrom(({ payload }) => [
        this.store.select(
          MembersSelectors.memberById(payload.event.url.split('/member/edit/')[1]),
        ),
      ]),
      map(([, memberToEdit]) =>
        memberToEdit
          ? MembersActions.editMemberSelected({ memberToEdit })
          : NavActions.navigationRequested({ path: NavPathTypes.MEMBERS }),
      ),
    ),
  );

  handleEventEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/event/edit/')),
      concatLatestFrom(({ payload }) => [
        this.store.select(
          ScheduleSelectors.eventById(payload.event.url.split('/event/edit/')[1]),
        ),
      ]),
      map(([, eventToEdit]) =>
        eventToEdit
          ? ScheduleActions.editEventSelected({ eventToEdit })
          : NavActions.navigationRequested({ path: NavPathTypes.SCHEDULE }),
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

  constructor(private actions$: Actions, private router: Router, private store: Store) {}
}
