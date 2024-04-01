import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { MembersActions } from '@app/store/members';
import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import { NavPathTypes } from '@app/types';
import { isValidArticleId, isValidEventId, isValidMemberId } from '@app/utils';

import * as NavActions from './nav.actions';
import { selectCurrentRoute } from './router.selectors';

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
      map(({ payload }) => {
        const [articleId, pageSection] = payload.event.url
          .split('/article/view/')[1]
          .split('#');
        return { articleId, pageSection };
      }),
      concatLatestFrom(({ articleId }) => [
        this.store.select(ArticlesSelectors.articleById(articleId)),
      ]),
      map(([{ articleId, pageSection }, articleInStore]) => {
        if (articleInStore) {
          return ArticlesActions.articleSetForViewing({
            article: articleInStore,
            sectionToScrollTo: pageSection,
          });
        } else if (isValidArticleId(articleId)) {
          return ArticlesActions.fetchArticleForViewScreenRequested({ articleId });
        } else {
          return NavActions.navigationRequested({ path: NavPathTypes.NEWS });
        }
      }),
    ),
  );

  handleArticleEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/article/edit/')),
      map(({ payload }) => payload.event.url.split('/article/edit/')[1]),
      concatLatestFrom(articleId => [
        this.store.select(ArticlesSelectors.articleById(articleId)),
        this.store.select(AuthSelectors.isAdmin),
      ]),
      map(([articleId, articleInStore, isAdmin]) => {
        if (articleInStore && isAdmin) {
          return ArticlesActions.articleSetForEditing({ article: articleInStore });
        } else if (isValidArticleId(articleId) && isAdmin) {
          return ArticlesActions.fetchArticleForEditScreenRequested({ articleId });
        } else {
          return NavActions.navigationRequested({ path: NavPathTypes.NEWS });
        }
      }),
    ),
  );

  handleMemberEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/member/edit/')),
      map(({ payload }) => payload.event.url.split('/member/edit/')[1]),
      concatLatestFrom(() => this.store.select(AuthSelectors.isAdmin)),
      map(([memberId, isAdmin]) => {
        // Attempt to re-fetch member (even if a member with the same id already exists
        // in the store) because admin-only properties might not have been fetched yet
        return isValidMemberId(memberId) && isAdmin
          ? MembersActions.fetchMemberForEditScreenRequested({ memberId })
          : NavActions.navigationRequested({ path: NavPathTypes.MEMBERS });
      }),
    ),
  );

  handleEventEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/event/edit/')),
      map(({ payload }) => payload.event.url.split('/event/edit/')[1]),
      concatLatestFrom(eventId => [
        this.store.select(ScheduleSelectors.eventById(eventId)),
        this.store.select(AuthSelectors.isAdmin),
      ]),
      map(([eventId, eventInStore, isAdmin]) => {
        if (eventInStore && isAdmin) {
          return ScheduleActions.eventSetForEditing({ event: eventInStore });
        } else if (isValidEventId(eventId) && isAdmin) {
          return ScheduleActions.fetchEventForEditScreenRequested({ eventId });
        } else {
          return NavActions.navigationRequested({ path: NavPathTypes.SCHEDULE });
        }
      }),
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

  navigateAfterArticleDeletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      concatLatestFrom(() => [this.store.select(selectCurrentRoute)]),
      filter(
        ([, currentRoute]) =>
          currentRoute?.routeConfig?.path === 'article/view/:article_id',
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.NEWS })),
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
        MembersActions.fetchMemberForEditScreenFailed,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.MEMBERS })),
    ),
  );

  navigateToMemberEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.fetchMemberForEditScreenSucceeded),
      map(({ member }) =>
        NavActions.navigationRequested({ path: NavPathTypes.MEMBER_EDIT + member.id }),
      ),
    ),
  );

  navigateToSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ScheduleActions.cancelSelected,
        ScheduleActions.addEventSucceeded,
        ScheduleActions.updateEventSucceeded,
        ScheduleActions.fetchEventForEditScreenFailed,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.SCHEDULE })),
    ),
  );

  navigateToEventEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.fetchEventForEditScreenSucceeded),
      map(({ event }) =>
        NavActions.navigationRequested({ path: NavPathTypes.EVENT_EDIT + event.id }),
      ),
    ),
  );

  navigateToNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.cancelSelected,
        ArticlesActions.fetchArticleForViewScreenFailed,
        ArticlesActions.fetchArticleForEditScreenFailed,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.NEWS })),
    ),
  );

  navigateToArticleView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
        ArticlesActions.fetchArticleForViewScreenSucceeded,
      ),
      map(({ article }) =>
        NavActions.navigationRequested({
          path: `${NavPathTypes.ARTICLE_VIEW}/${article.id}`,
        }),
      ),
    ),
  );

  navigateToArticleEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleForEditScreenSucceeded),
      map(({ article }) =>
        NavActions.navigationRequested({
          path: `${NavPathTypes.ARTICLE_EDIT}/${article.id}`,
        }),
      ),
    ),
  );

  constructor(private actions$: Actions, private router: Router, private store: Store) {}
}
