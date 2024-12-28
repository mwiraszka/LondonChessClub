import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesActions } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { MembersActions } from '@app/store/members';
import { isDefined, isValidCollectionId } from '@app/utils';

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
      map(() => NavActions.navigationRequested({ path: '' })),
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
      map(() => NavActions.navigationRequested({ path: 'members' })),
    ),
  );

  navigateToSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EventsActions.cancelSelected,
        EventsActions.addEventSucceeded,
        EventsActions.updateEventSucceeded,
        EventsActions.fetchEventFailed,
      ),
      map(() => NavActions.navigationRequested({ path: 'schedule' })),
    ),
  );

  navigateToNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.cancelSelected,
        ArticlesActions.fetchArticleFailed,
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: 'news' })),
    ),
  );

  navigateToChangePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.newPasswordChallengeRequested),
      map(() => NavActions.navigationRequested({ path: 'change-password' })),
    ),
  );

  handleLogoutRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url === '/logout'),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectUser)),
      filter(isDefined),
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

        if (controlMode === 'add' && !isDefined(eventId)) {
          return EventsActions.newEventRequested();
        } else if (controlMode === 'edit' && isValidCollectionId(eventId)) {
          return EventsActions.fetchEventRequested({ controlMode, eventId });
        }
        return NavActions.navigationRequested({ path: 'schedule' });
      }),
    ),
  );

  unsetEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
        return (
          !!previousPath?.startsWith('/event/') &&
          !currentPath?.startsWith('/event/edit') &&
          currentPath !== '/event/add'
        );
      }),
      map(() => EventsActions.eventUnset()),
    ),
  );

  handleMemberRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/member/')),
      map(currentPath => {
        const [controlMode, memberId] = currentPath.split('/member/')[1].split('/');

        if (controlMode === 'add' && !isDefined(memberId)) {
          return MembersActions.newMemberRequested();
        } else if (controlMode === 'edit' && isValidCollectionId(memberId)) {
          return MembersActions.fetchMemberRequested({ controlMode, memberId });
        }
        return NavActions.navigationRequested({ path: 'members' });
      }),
    ),
  );

  unsetMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
        return (
          !!previousPath?.startsWith('/member/') &&
          !currentPath?.startsWith('/member/edit') &&
          currentPath !== '/member/add'
        );
      }),
      map(() => MembersActions.memberUnset()),
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

        if (controlMode === 'add' && !isDefined(articleIdWithAnchor)) {
          return ArticlesActions.newArticleRequested();
        }

        const articleId = articleIdWithAnchor?.split('#')[0];

        if (
          (controlMode === 'edit' && isValidCollectionId(articleId)) ||
          (controlMode === 'view' && isValidCollectionId(articleId))
        ) {
          return ArticlesActions.fetchArticleRequested({
            controlMode,
            articleId,
          });
        }

        return NavActions.navigationRequested({ path: 'news' });
      }),
    ),
  );

  unsetArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
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
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(
        ([{ article }, previousPath]) => previousPath === `/article/view/${article.id}`,
      ),
      map(() => NavActions.navigationRequested({ path: 'news' })),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
