import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

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
          NavActions.homeTabSelected,
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
          NavActions.membersTabSelected,
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
        ofType(NavActions.scheduleTabSelected),
        tap(() => this.router.navigate([NavPaths.SCHEDULE]))
      ),
    { dispatch: false }
  );

  navigateToNews$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.newsTabSelected,
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
        ofType(NavActions.cityChampionTabSelected),
        tap(() => this.router.navigate([NavPaths.CITY_CHAMPION]))
      ),
    { dispatch: false }
  );

  navigateToLessons$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.lessonsTabSelected),
        tap(() => this.router.navigate([NavPaths.LESSONS]))
      ),
    { dispatch: false }
  );

  navigateToSupplies$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.suppliesTabSelected),
        tap(() => this.router.navigate([NavPaths.SUPPLIES]))
      ),
    { dispatch: false }
  );

  navigateToAbout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.aboutTabSelected),
        tap(() => this.router.navigate([NavPaths.ABOUT]))
      ),
    { dispatch: false }
  );

  navigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.adminLoginSelected),
        tap(() => this.router.navigate([NavPaths.LOGIN]))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
