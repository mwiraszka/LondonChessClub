/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { MembersService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { Member, ModificationInfo, ServiceResponse } from '@app/types';

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
          map((response: ServiceResponse<Member[]>) => {
            return response.error
              ? MembersActions.loadMembersFailed({ error: response.error })
              : MembersActions.loadMembersSucceeded({
                  allMembers: response.payload!,
                });
          }),
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
      concatLatestFrom(() => [
        this.store.select(MembersSelectors.memberCurrently),
        this.store.select(AuthSelectors.user),
      ]),
      switchMap(([, memberToAdd, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: `${user!.firstName} ${user!.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedMember = { ...memberToAdd, modificationInfo };

        return this.membersService.addMember(modifiedMember!).pipe(
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
      concatLatestFrom(() => [
        this.store.select(MembersSelectors.memberCurrently),
        this.store.select(AuthSelectors.user),
      ]),
      switchMap(([, memberToUpdate, user]) => {
        const dateNow = new Date(Date.now());
        const modificationInfo: ModificationInfo = {
          createdBy: memberToUpdate.modificationInfo!.createdBy,
          dateCreated: memberToUpdate.modificationInfo!.dateCreated,
          lastEditedBy: `${user!.firstName} ${user!.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedMember = { ...memberToUpdate, modificationInfo };

        return this.membersService.updateMember(modifiedMember!).pipe(
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
