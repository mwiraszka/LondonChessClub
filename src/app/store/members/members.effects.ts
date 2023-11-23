/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { MembersService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { Member, ServiceResponse } from '@app/types';

import * as MembersActions from './members.actions';
import * as MembersSelectors from './members.selectors';

@Injectable()
export class MembersEffects {
  getMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.loadMembersStarted),
      concatLatestFrom(() => this.store.select(AuthSelectors.isAdmin)),
      switchMap(([, isAdmin]) =>
        this.membersService.getMembers(isAdmin!).pipe(
          map((response: ServiceResponse<Member[]>) =>
            response.error
              ? MembersActions.loadMembersFailed({ error: response.error })
              : MembersActions.loadMembersSucceeded({
                  allMembers: response.payload!,
                }),
          ),
        ),
      ),
    );
  });

  deleteMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberConfirmed),
      concatLatestFrom(() => this.store.select(MembersSelectors.selectedMember)),
      switchMap(([, memberToDelete]) =>
        this.membersService.deleteMember(memberToDelete!).pipe(
          map((response: ServiceResponse<Member>) =>
            response.error
              ? MembersActions.deleteMemberFailed({ error: response.error })
              : MembersActions.deleteMemberSucceeded({
                  deletedMember: response.payload!,
                }),
          ),
        ),
      ),
    );
  });

  addMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberConfirmed),
      concatLatestFrom(() => this.store.select(MembersSelectors.memberCurrently)),
      switchMap(([, memberToAdd]) => {
        return this.membersService.addMember(memberToAdd!).pipe(
          map((response: ServiceResponse<Member>) =>
            response.error
              ? MembersActions.addMemberFailed({ error: response.error })
              : MembersActions.addMemberSucceeded({
                  addedMember: response.payload!,
                }),
          ),
        );
      }),
    );
  });

  updateMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberConfirmed),
      concatLatestFrom(() => this.store.select(MembersSelectors.memberCurrently)),
      switchMap(([, memberToUpdate]) => {
        return this.membersService.updateMember(memberToUpdate!).pipe(
          map((response: ServiceResponse<Member>) =>
            response.error
              ? MembersActions.updateMemberFailed({ error: response.error })
              : MembersActions.updateMemberSucceeded({
                  updatedMember: response.payload!,
                }),
          ),
        );
      }),
    );
  });

  resetMemberEditorForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter(
        (action: RouterNavigatedAction) =>
          action.payload.event.urlAfterRedirects === '/member/add',
      ),
      map(() => MembersActions.resetMemberForm()),
    ),
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          MembersActions.addMemberFailed,
          MembersActions.updateMemberFailed,
          MembersActions.loadMembersFailed,
          MembersActions.deleteMemberFailed,
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private membersService: MembersService,
    private store: Store,
  ) {}
}
