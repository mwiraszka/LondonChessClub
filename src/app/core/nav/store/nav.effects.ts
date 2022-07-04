import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AuthActions } from '@app/core/auth';
import { ArticleEditorScreenActions, ArticleGridActions } from '@app/screens/articles';
import { MemberEditorScreenActions, MemberListScreenActions } from '@app/screens/members';
import { AlertActions } from '@app/shared/components/alert';

import * as NavActions from './nav.actions';
import { NavPathTypes } from '../types/nav-paths.model';

@Injectable()
export class NavEffects {
  navigateHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.homeSelected,
          MemberEditorScreenActions.addMemberSucceeded,
          MemberEditorScreenActions.updateMemberSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.HOME]))
      ),
    { dispatch: false }
  );

  navigateToMembers$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.membersSelected,
          MemberEditorScreenActions.cancelSelected,
          MemberEditorScreenActions.addMemberSucceeded,
          MemberEditorScreenActions.updateMemberSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.MEMBERS]))
      ),
    { dispatch: false }
  );

  navigateToMembersAdd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListScreenActions.createMemberSelected),
        tap(() => this.router.navigate([NavPathTypes.MEMBERS_ADD]))
      ),
    { dispatch: false }
  );

  navigateToMembersEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListScreenActions.editMemberSelected),
        tap((val) => console.log('::', val)),
        tap(({ memberToEdit }) =>
          this.router.navigate([NavPathTypes.MEMBERS_EDIT, memberToEdit.id])
        )
      ),
    { dispatch: false }
  );

  navigateToSchedule$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.scheduleSelected, AlertActions.seeScheduleSelected),
        tap(() => this.router.navigate([NavPathTypes.SCHEDULE]))
      ),
    { dispatch: false }
  );

  navigateToNews$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.newsSelected,
          ArticleEditorScreenActions.cancelSelected,
          ArticleEditorScreenActions.publishArticleSucceeded,
          ArticleEditorScreenActions.updateArticleSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.NEWS]))
      ),
    { dispatch: false }
  );

  navigateToNewsCompose$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticleGridActions.createArticleSelected),
        tap(() => this.router.navigate([NavPathTypes.NEWS_COMPOSE]))
      ),
    { dispatch: false }
  );

  navigateToNewsEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticleGridActions.editArticleSelected),
        tap(({ articleToEdit }) =>
          this.router.navigate([NavPathTypes.NEWS_EDIT, articleToEdit.id])
        )
      ),
    { dispatch: false }
  );

  navigateToLondonChessChampion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.londonChessChampionSelected),
        tap(() => this.router.navigate([NavPathTypes.LONDON_CHESS_CHAMPION]))
      ),
    { dispatch: false }
  );

  navigateToPhotoGallery$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.photoGallerySelected),
        tap(() => this.router.navigate([NavPathTypes.PHOTO_GALLERY]))
      ),
    { dispatch: false }
  );

  navigateToAbout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.aboutSelected),
        tap(() => this.router.navigate([NavPathTypes.ABOUT]))
      ),
    { dispatch: false }
  );

  navigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.loginSelected,
          NavActions.logoutSelected,
          AuthActions.alreadyHaveAccountSelected
        ),
        tap(() => this.router.navigate([NavPathTypes.LOGIN]))
      ),
    { dispatch: false }
  );

  navigateToSignUp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.dontHaveAccountSelected),
        tap(() => this.router.navigate([NavPathTypes.SIGN_UP]))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
