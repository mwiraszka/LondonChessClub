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
import { isValidEventId } from '@app/utils';

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
      map(([{ pageSection }, article]) =>
        article
          ? ArticlesActions.viewArticleRouteEntered({
              article,
              sectionToScrollTo: pageSection,
            })
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
        this.store.select(AuthSelectors.isAdmin),
      ]),
      map(([, article, isAdmin]) =>
        article && isAdmin
          ? ArticlesActions.editArticleRouteEntered({ article })
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
        this.store.select(AuthSelectors.isAdmin),
      ]),
      map(([, member, isAdmin]) =>
        member && isAdmin
          ? MembersActions.editMemberRouteEntered({ member })
          : NavActions.navigationRequested({ path: NavPathTypes.MEMBERS }),
      ),
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
          return ScheduleActions.eventEditRouteEntered({ event: eventInStore });
        } else if (!isValidEventId(eventId) && isAdmin) {
          return ScheduleActions.fetchEventForEventEditRouteRequested({ eventId });
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
        ScheduleActions.fetchEventForEventEditRouteFailed,
      ),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.SCHEDULE })),
    ),
  );

  navigateToEventEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.fetchEventForEventEditRouteSucceeded),
      map(({ event }) =>
        NavActions.navigationRequested({ path: NavPathTypes.EVENT_EDIT + event.id }),
      ),
    ),
  );

  navigateToNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.cancelSelected),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.NEWS })),
    ),
  );

  navigateToArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
      ),
      map(({ article }) =>
        NavActions.navigationRequested({
          path: `${NavPathTypes.ARTICLE_VIEW}/${article.id}`,
        }),
      ),
    ),
  );

  constructor(private actions$: Actions, private router: Router, private store: Store) {}
}
