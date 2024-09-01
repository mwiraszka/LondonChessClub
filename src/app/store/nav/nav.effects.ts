import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import {
  NavPathTypes,
  newArticleFormTemplate,
  newClubEventFormTemplate,
  newMemberFormTemplate,
} from '@app/types';
import { isValidArticleId, isValidEventId, isValidMemberId } from '@app/utils';

import { NavSelectors } from '.';
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

  appendPathToHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => NavActions.appendPathToHistory({ path: payload.event.url })),
    ),
  );

  handleArticleViewRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/article/view/')),
      map(({ payload }) => {
        const currentPath = payload.event.url;
        const articleId = currentPath.split('/article/view/')[1].split('#')[0];
        return { currentPath, articleId };
      }),
      concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
      filter(([{ currentPath }, previousPath]) => currentPath !== previousPath),
      concatLatestFrom(([{ articleId }]) =>
        this.store.select(ArticlesSelectors.articleById(articleId)),
      ),
      map(([[{ articleId }], articleInStore]) => {
        return articleInStore
          ? ArticlesActions.setArticle({
              article: articleInStore,
              isEditMode: null,
            })
          : ArticlesActions.fetchArticleRequested({ articleId });
      }),
    ),
  );

  handleArticleAddRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url === '/article/add'),
      concatLatestFrom(() => [
        this.store.select(NavSelectors.previousPath),
        this.store.select(ArticlesSelectors.articleCurrently),
      ]),
      map(([, previousPath, articleCurrently]) => {
        return previousPath === '/article/add' &&
          (articleCurrently?.imageUrl || localStorage.getItem('imageUrl'))
          ? ArticlesActions.getArticleImageUrlRequested({})
          : ArticlesActions.setArticle({
              article: articleCurrently ?? newArticleFormTemplate,
              isEditMode: false,
            });
      }),
    ),
  );

  handleArticleEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/article/edit/')),
      map(({ payload }) => payload.event.url),
      concatLatestFrom(currentPath => [
        this.store.select(
          ArticlesSelectors.articleById(currentPath.split('/article/edit/')[1]),
        ),
        this.store.select(NavSelectors.previousPath),
      ]),
      map(([currentPath, articleInStore, previousPath]) => {
        const articleId = currentPath.split('/article/edit/')[1];
        if (currentPath === previousPath && articleInStore?.imageId) {
          return ArticlesActions.getArticleImageUrlRequested({
            imageId: articleInStore.imageId,
          });
        } else if (articleInStore) {
          return ArticlesActions.setArticle({
            article: articleInStore,
            isEditMode: true,
          });
        } else if (isValidArticleId(articleId)) {
          return ArticlesActions.fetchArticleRequested({ articleId });
        } else {
          return NavActions.navigationRequested({ path: NavPathTypes.NEWS });
        }
      }),
    ),
  );

  clearArticleImageUrlFromLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
        tap(([{ payload }, previousPath]) => {
          if (
            payload.event.url !== previousPath &&
            (previousPath?.startsWith('/article/edit') || previousPath === '/article/add')
          ) {
            localStorage.removeItem('imageUrl');
          }
        }),
      ),
    { dispatch: false },
  );

  handleMemberAddRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url === '/member/add'),
      concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
      filter(([{ payload }, previousPath]) => payload.event.url !== previousPath),
      map(() =>
        MembersActions.setMember({
          member: newMemberFormTemplate,
          isEditMode: false,
        }),
      ),
    ),
  );

  handleMemberEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/member/edit/')),
      concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
      filter(([{ payload }, previousPath]) => payload.event.url !== previousPath),
      map(([{ payload }]) => payload.event.url.split('/member/edit/')[1]),
      concatLatestFrom(memberId =>
        this.store.select(MembersSelectors.memberById(memberId)),
      ),
      map(([memberId, memberInStore]) => {
        if (memberInStore) {
          return MembersActions.setMember({
            member: memberInStore,
            isEditMode: true,
          });
        } else if (isValidMemberId(memberId)) {
          return MembersActions.fetchMemberRequested({ memberId });
        } else {
          return NavActions.navigationRequested({ path: NavPathTypes.MEMBERS });
        }
      }),
    ),
  );

  handleEventAddRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url === '/event/add'),
      concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
      filter(([{ payload }, previousPath]) => payload.event.url !== previousPath),
      map(() =>
        ScheduleActions.setEvent({
          event: newClubEventFormTemplate,
          isEditMode: false,
        }),
      ),
    ),
  );

  handleEventEditRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      filter(({ payload }) => payload.event.url.startsWith('/event/edit/')),
      concatLatestFrom(() => this.store.select(NavSelectors.previousPath)),
      filter(([{ payload }, previousPath]) => payload.event.url !== previousPath),
      map(([{ payload }]) => payload.event.url.split('/event/edit/')[1]),
      concatLatestFrom(eventId =>
        this.store.select(ScheduleSelectors.eventById(eventId)),
      ),
      map(([eventId, eventInStore]) => {
        if (eventInStore) {
          return ScheduleActions.setEvent({
            event: eventInStore,
            isEditMode: true,
          });
        } else if (isValidEventId(eventId)) {
          return ScheduleActions.fetchEventRequested({ eventId });
        } else {
          return NavActions.navigationRequested({
            path: NavPathTypes.SCHEDULE,
          });
        }
      }),
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

  navigateHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSucceeded, AuthActions.passwordChangeSucceeded),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.HOME })),
    ),
  );

  navigateToMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.cancelSelected, MembersActions.fetchMemberFailed),
      map(() => NavActions.navigationRequested({ path: NavPathTypes.MEMBERS })),
    ),
  );

  navigateToSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ScheduleActions.cancelSelected,
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

  navigateAfterSuccessfulArticleFetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleSucceeded),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.isEditMode)),
      map(([{ article }, isEditMode]) => {
        const path = isEditMode
          ? NavPathTypes.ARTICLE + '/' + NavPathTypes.EDIT + '/' + article.id
          : NavPathTypes.ARTICLE + '/' + NavPathTypes.VIEW + '/' + article.id;
        return NavActions.navigationRequested({ path });
      }),
    ),
  );

  navigateAfterSuccessfulEventFetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.fetchEventSucceeded),
      map(({ event }) => {
        return NavActions.navigationRequested({
          path: NavPathTypes.EVENT + '/' + NavPathTypes.EDIT + '/' + event.id,
        });
      }),
    ),
  );

  navigateAfterSuccessfulMemberFetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.fetchMemberSucceeded),
      map(({ member }) => {
        return NavActions.navigationRequested({
          path: NavPathTypes.MEMBER + '/' + NavPathTypes.EDIT + '/' + member.id,
        });
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
