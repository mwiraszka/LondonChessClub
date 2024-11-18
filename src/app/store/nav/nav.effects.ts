import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesActions } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { MembersActions } from '@app/store/members';
import { ScheduleActions } from '@app/store/schedule';
import { NavPathTypes } from '@app/types';

import { NavSelectors } from '.';
import * as NavActions from './nav.actions';

@Injectable()
export class NavEffects {
  appendPathToHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => NavActions.appendPathToHistory({ path: payload.event.url })),
    ),
  );

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
        MembersActions.fetchMemberFailed,
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
        ScheduleActions.fetchEventFailed,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.SCHEDULE })),
    ),
  );

  navigateToNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.cancelSelected, ArticlesActions.fetchArticleFailed),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.NEWS })),
    ),
  );

  navigateToArticleView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
      ),
      map(({ article }) =>
        NavActions.navigationRequested({
          path: NavPathTypes.ARTICLE + '/' + NavPathTypes.VIEW + '/' + article.id,
        }),
      ),
    ),
  );

  navigateToChangePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.newPasswordChallengeRequested),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.CHANGE_PASSWORD })),
    ),
  );

  handleLogoutRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url === '/logout'),
      concatLatestFrom(() => this.store.select(AuthSelectors.user)),
      filter(([, user]) => !!user),
      map(() => AuthActions.logoutRequested()),
    ),
  );

  handleEventRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/event/')),
      map(currentPath => {
        const [controlMode, eventId] = currentPath.split('/event/')[1].split('/');

        return controlMode === 'add' && !eventId
          ? ScheduleActions.eventAddRequested()
          : controlMode === 'edit' && !!eventId
            ? ScheduleActions.eventEditRequested({ eventId })
            : NavActions.navigationRequested({ path: NavPathTypes.SCHEDULE });
      }),
    ),
  );

  handleMemberRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/member/')),
      map(currentPath => {
        const [controlMode, memberId] = currentPath.split('/member/')[1].split('/');

        return controlMode === 'add' && !memberId
          ? MembersActions.memberAddRequested()
          : controlMode === 'edit' && !!memberId
            ? MembersActions.memberEditRequested({ memberId })
            : NavActions.navigationRequested({ path: NavPathTypes.MEMBERS });
      }),
    ),
  );

  handleArticleRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/article/')),
      map(currentPath => {
        const [controlMode, articleIdWithAnchor] = currentPath
          .split('/article/')[1]
          .split('/');
        const articleId = articleIdWithAnchor?.split('#')[0];

        return controlMode === 'add' && !articleId
          ? ArticlesActions.articleAddRequested()
          : controlMode === 'edit' && !!articleId
            ? ArticlesActions.articleEditRequested({ articleId })
            : controlMode === 'view' && !!articleId
              ? ArticlesActions.articleViewRequested({ articleId })
              : NavActions.navigationRequested({ path: NavPathTypes.NEWS });
      }),
    ),
  );

  unsetArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
      map(([{ payload }, previousPath]) => {
        return { currentPath: payload.event.url, previousPath };
      }),
      filter(({ currentPath, previousPath }) => {
        return (
          !!previousPath?.startsWith('/article/') &&
          !currentPath?.startsWith('/article/edit') &&
          currentPath !== '/article/add'
        );
      }),
      map(() => ArticlesActions.articleUnset()),
    ),
  );

  redirectToNewsRouteAfterArticleDeletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
      filter(
        ([{ article }, previousPath]) => previousPath === `/article/view/${article.id}`,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.NEWS })),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
