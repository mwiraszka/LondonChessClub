import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AuthActions } from '@app/core/auth';
import { ArticleEditorActions, ArticleListActions } from '@app/pages/articles';
import { MemberEditorActions, MemberListActions } from '@app/pages/members';

import * as NavActions from './nav.actions';
import { NavPaths } from '../types/nav-paths.model';

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
        tap(() => this.router.navigate([NavPaths.HOME]))
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
        tap(() => this.router.navigate([NavPaths.MEMBERS]))
      ),
    { dispatch: false }
  );

  navigateToMembersAdd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListActions.createMemberSelected),
        tap(() => this.router.navigate([NavPaths.MEMBERS_ADD]))
      ),
    { dispatch: false }
  );

  navigateToMembersEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListActions.editMemberSelected),
        tap(({ memberToEdit }) =>
          this.router.navigate([NavPaths.MEMBERS_EDIT, memberToEdit._id])
        )
      ),
    { dispatch: false }
  );

  navigateToSchedule$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.scheduleSelected),
        tap(() => this.router.navigate([NavPaths.SCHEDULE]))
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
        tap(() => this.router.navigate([NavPaths.NEWS]))
      ),
    { dispatch: false }
  );

  navigateToNewsCompose$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticleListActions.createArticleSelected),
        tap(() => this.router.navigate([NavPaths.NEWS_COMPOSE]))
      ),
    { dispatch: false }
  );

  navigateToNewsEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ArticleListActions.editArticleSelected),
        tap(({ articleToEdit }) =>
          this.router.navigate([NavPaths.NEWS_EDIT, articleToEdit._id])
        )
      ),
    { dispatch: false }
  );

  navigateToCityChampion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.cityChampionSelected),
        tap(() => this.router.navigate([NavPaths.CITY_CHAMPION]))
      ),
    { dispatch: false }
  );

  navigateToLessons$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.lessonsSelected),
        tap(() => this.router.navigate([NavPaths.LESSONS]))
      ),
    { dispatch: false }
  );

  navigateToSupplies$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.suppliesSelected),
        tap(() => this.router.navigate([NavPaths.SUPPLIES]))
      ),
    { dispatch: false }
  );

  navigateToAbout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.aboutSelected),
        tap(() => this.router.navigate([NavPaths.ABOUT]))
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
        tap(() => this.router.navigate([NavPaths.LOGIN]))
      ),
    { dispatch: false }
  );

  navigateToSignUp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.dontHaveAccountSelected),
        tap(() => this.router.navigate([NavPaths.SIGN_UP]))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
