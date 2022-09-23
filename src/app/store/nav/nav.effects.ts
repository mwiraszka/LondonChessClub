import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { ArticlesActions } from '@app/store/articles';
import { AuthActions } from '@app/store/auth';
import { ScheduleActions } from '@app/store/schedule';
import { MembersActions } from '@app/store/members';
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
          AuthActions.passwordChangeSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.HOME]))
      ),
    { dispatch: false }
  );

  navigateToMembers$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.membersNavigationRequested,
          MembersActions.cancelSelected,
          MembersActions.addMemberSucceeded,
          MembersActions.updateMemberSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.MEMBERS]))
      ),
    { dispatch: false }
  );

  navigateToMemberAdd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MembersActions.createMemberSelected),
        tap(() => this.router.navigate([NavPathTypes.MEMBER_ADD]))
      ),
    { dispatch: false }
  );

  navigateToMemberEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MembersActions.editMemberSelected),
        tap(({ memberToEdit }) =>
          this.router.navigate([NavPathTypes.MEMBER_EDIT, memberToEdit.id])
        )
      ),
    { dispatch: false }
  );

  navigateToSchedule$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.scheduleNavigationRequested,
          ScheduleActions.cancelSelected,
          ScheduleActions.addEventSucceeded,
          ScheduleActions.updateEventSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.SCHEDULE]))
      ),
    { dispatch: false }
  );

  navigateToEventAdd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ScheduleActions.createEventSelected),
        tap(() => this.router.navigate([NavPathTypes.EVENT_ADD]))
      ),
    { dispatch: false }
  );

  navigateToEventEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ScheduleActions.editEventSelected),
        tap(({ eventToEdit }) =>
          this.router.navigate([NavPathTypes.EVENT_EDIT, eventToEdit.id])
        )
      ),
    { dispatch: false }
  );

  navigateToNews$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.newsNavigationRequested,
          ArticlesActions.cancelSelected,
          ArticlesActions.publishArticleSucceeded,
          ArticlesActions.updateArticleSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.NEWS]))
      ),
    { dispatch: false }
  );

  navigateToArticleAdd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticlesActions.createArticleSelected),
        tap(() => this.router.navigate([NavPathTypes.ARTICLE_ADD]))
      ),
    { dispatch: false }
  );

  navigateToArticleEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticlesActions.editArticleSelected),
        tap(({ articleToEdit }) =>
          this.router.navigate([NavPathTypes.ARTICLE_EDIT, articleToEdit.id])
        )
      ),
    { dispatch: false }
  );

  navigateToLondonChessChampion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.londonChessChampionNavigationRequested),
        tap(() => this.router.navigate([NavPathTypes.LONDON_CHESS_CHAMPION]))
      ),
    { dispatch: false }
  );

  navigateToPhotoGallery$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.photoGalleryNavigationRequested),
        tap(() => this.router.navigate([NavPathTypes.PHOTO_GALLERY]))
      ),
    { dispatch: false }
  );

  navigateToAbout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.aboutNavigationRequested),
        tap(() => this.router.navigate([NavPathTypes.ABOUT]))
      ),
    { dispatch: false }
  );

  navigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.loginNavigationRequested, AuthActions.logoutSucceeded),
        tap(() => this.router.navigate([NavPathTypes.LOGIN]))
      ),
    { dispatch: false }
  );

  navigateToChangePassword$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.forgotPasswordSelected,
          NavActions.changePasswordNavigationRequested
        ),
        tap(() => this.router.navigate([NavPathTypes.CHANGE_PASSWORD]))
      ),
    { dispatch: false }
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
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}