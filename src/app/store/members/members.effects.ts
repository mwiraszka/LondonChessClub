import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { MembersService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { ServiceResponse } from '@app/types';

import * as MembersActions from './members.actions';
import * as MembersSelectors from './members.selectors';

@Injectable()
export class MembersEffects {
  getMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.loadMembersStarted),
      concatLatestFrom(() => this.store.select(AuthSelectors.isAdmin)),
      switchMap(([, isAdmin]) =>
        this.membersService.getMembers(isAdmin).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MembersActions.loadMembersFailed({ error: response.error })
              : MembersActions.loadMembersSucceeded({
                  allMembers: response.payload.members,
                })
          )
        )
      )
    )
  );

  deleteMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.deleteMemberConfirmed),
      concatLatestFrom(() => this.store.select(MembersSelectors.selectedMember)),
      switchMap(([, memberToDelete]) =>
        this.membersService.deleteMember(memberToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MembersActions.deleteMemberFailed({ error: response.error })
              : MembersActions.deleteMemberSucceeded({
                  deletedMember: response.payload.member,
                })
          )
        )
      )
    )
  );

  addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.addMemberConfirmed),
      concatLatestFrom(() => this.store.select(MembersSelectors.memberCurrently)),
      switchMap(([, memberToAdd]) => {
        return this.membersService.addMember(memberToAdd).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MembersActions.addMemberFailed({ error: response.error })
              : MembersActions.addMemberSucceeded({
                  addedMember: response.payload.member,
                })
          )
        );
      })
    )
  );

  updateMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.updateMemberConfirmed),
      concatLatestFrom(() => this.store.select(MembersSelectors.memberCurrently)),
      switchMap(([, memberToUpdate]) => {
        return this.membersService.updateMember(memberToUpdate).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MembersActions.updateMemberFailed({ error: response.error })
              : MembersActions.updateMemberSucceeded({
                  updatedMember: response.payload.member,
                })
          )
        );
      })
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          MembersActions.addMemberFailed,
          MembersActions.updateMemberFailed,
          MembersActions.loadMembersFailed,
          MembersActions.deleteMemberFailed
        ),
        tap(({ error }) => {
          console.error(`[Members Effects]' ${error.message}`);
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
