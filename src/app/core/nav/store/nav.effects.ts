import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AuthActions } from '@app/core/auth';
import { ArticleEditorActions, ArticleListActions } from '@app/pages/articles';
import { MemberEditorActions, MemberListActions } from '@app/pages/members';
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
          MemberEditorActions.addMemberSucceeded,
          MemberEditorActions.updateMemberSucceeded
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
          MemberEditorActions.cancelSelected,
          MemberEditorActions.addMemberSucceeded,
          MemberEditorActions.updateMemberSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.MEMBERS]))
      ),
    { dispatch: false }
  );

  navigateToMembersAdd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListActions.createMemberSelected),
        tap(() => this.router.navigate([NavPathTypes.MEMBERS_ADD]))
      ),
    { dispatch: false }
  );

  navigateToMembersEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListActions.editMemberSelected),
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
          ArticleEditorActions.cancelSelected,
          ArticleEditorActions.publishArticleSucceeded,
          ArticleEditorActions.updateArticleSucceeded
        ),
        tap(() => this.router.navigate([NavPathTypes.NEWS]))
      ),
    { dispatch: false }
  );

  navigateToNewsCompose$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticleListActions.createArticleSelected),
        tap(() => this.router.navigate([NavPathTypes.NEWS_COMPOSE]))
      ),
    { dispatch: false }
  );

  navigateToNewsEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticleListActions.editArticleSelected),
        tap(({ articleToEdit }) =>
          this.router.navigate([NavPathTypes.NEWS_EDIT, articleToEdit.id])
        )
      ),
    { dispatch: false }
  );

  navigateToCityChampion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.cityChampionSelected),
        tap(() => this.router.navigate([NavPathTypes.CITY_CHAMPION]))
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
