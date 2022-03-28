import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import * as MemberListActions from './member-list.actions';
import * as MemberListSelectors from './member-list.selectors';
import { MembersService } from '../../members.service';

@Injectable()
export class MemberListEffects {
  getMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.loadMembersStarted),
      switchMap(() => {
        return this.membersService.getMembers().pipe(
          map((allMembers) => {
            return MemberListActions.loadMembersSucceeded({ allMembers });
          }),
          catchError(() => {
            return of(
              MemberListActions.loadMembersFailed({
                errorMessage:
                  '[Member List Effects] Failed to fetch members from database.',
              })
            );
          })
        );
      })
    )
  );

  deleteMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.deleteMemberConfirmed),
      concatLatestFrom(() => this.store.select(MemberListSelectors.selectedMember)),
      switchMap(([, memberToDelete]) => {
        return this.membersService.deleteMember(memberToDelete).pipe(
          map((deletedMember) => {
            return MemberListActions.deleteMemberSucceeded({ deletedMember });
          }),
          catchError(() => {
            return of(
              MemberListActions.deleteMemberFailed({
                errorMessage: '[Member List Effects] Unknown error',
              })
            );
          })
        );
      })
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListActions.loadMembersFailed, MemberListActions.deleteMemberFailed),
        tap(({ errorMessage }) => {
          console.error(errorMessage);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private membersService: MembersService,
    private store: Store
  ) {}
}
