import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ArticlesActions } from '@app/store/articles';
import { AuthActions } from '@app/store/auth';
import { MembersActions } from '@app/store/members';
import { ScheduleActions } from '@app/store/schedule';
import { NavPathTypes } from '@app/types';

import * as NavActions from './nav.actions';

@Injectable()
export class NavEffects {
  navigateHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.homeNavigationRequested,
          MembersActions.addMemberSucceeded,
          MembersActions.updateMemberSucceeded,
          AuthActions.loginSucceeded,
          AuthActions.passwordChangeSucceeded,
        ),
        tap(() => this.router.navigate([NavPathTypes.HOME])),
      ),
    { dispatch: false },
  );

  navigateToMembers$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.membersNavigationRequested,
          MembersActions.cancelSelected,
          MembersActions.addMemberSucceeded,
          MembersActions.updateMemberSucceeded,
        ),
        tap(() => this.router.navigate([NavPathTypes.MEMBERS])),
      ),
    { dispatch: false },
  );

  navigateToMemberEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MembersActions.editMemberSelected),
        tap(({ memberToEdit }) =>
          this.router.navigate([NavPathTypes.MEMBER_EDIT, memberToEdit.id]),
        ),
      ),
    { dispatch: false },
  );

  navigateToSchedule$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.scheduleNavigationRequested,
          ScheduleActions.cancelSelected,
          ScheduleActions.addEventSucceeded,
          ScheduleActions.updateEventSucceeded,
        ),
        tap(() => this.router.navigate([NavPathTypes.SCHEDULE])),
      ),
    { dispatch: false },
  );

  navigateToEventEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ScheduleActions.editEventSelected),
        tap(({ eventToEdit }) =>
          this.router.navigate([NavPathTypes.EVENT_EDIT, eventToEdit.id]),
        ),
      ),
    { dispatch: false },
  );

  // TODO: check activated route when deleteArticleSucceeded action dispatched
  // and only navigate to News screen if coming from the Article Viewer screen
  navigateToNews$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.newsNavigationRequested,
          ArticlesActions.cancelSelected,
          ArticlesActions.publishArticleSucceeded,
          ArticlesActions.updateArticleSucceeded,
          ArticlesActions.deleteArticleSucceeded,
        ),
        tap(() => this.router.navigate([NavPathTypes.NEWS])),
      ),
    { dispatch: false },
  );

  navigateToArticle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticlesActions.articleSelected),
        tap(({ article }) =>
          this.router.navigate([NavPathTypes.ARTICLE_VIEW, article.id]),
        ),
      ),
    { dispatch: false },
  );

  navigateToArticleEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticlesActions.editArticleSelected),
        tap(({ articleToEdit }) =>
          this.router.navigate([NavPathTypes.ARTICLE_EDIT, articleToEdit.id]),
        ),
      ),
    { dispatch: false },
  );

  navigateToCityChampion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.cityChampionNavigationRequested),
        tap(() => this.router.navigate([NavPathTypes.CITY_CHAMPION])),
      ),
    { dispatch: false },
  );

  navigateToPhotoGallery$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.photoGalleryNavigationRequested),
        tap(() => this.router.navigate([NavPathTypes.PHOTO_GALLERY])),
      ),
    { dispatch: false },
  );

  navigateToAbout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.aboutNavigationRequested),
        tap(() => this.router.navigate([NavPathTypes.ABOUT])),
      ),
    { dispatch: false },
  );

  navigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.loginNavigationRequested, AuthActions.logoutSucceeded),
        tap(() => this.router.navigate([NavPathTypes.LOGIN])),
      ),
    { dispatch: false },
  );

  navigateToChangePassword$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.forgotPasswordSelected,
          NavActions.changePasswordNavigationRequested,
        ),
        tap(() => this.router.navigate([NavPathTypes.CHANGE_PASSWORD])),
      ),
    { dispatch: false },
  );

  navigateToLink$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.linkSelected),
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

  constructor(private actions$: Actions, private router: Router) {}
}
