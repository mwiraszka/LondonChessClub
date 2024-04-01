/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { LoaderService, MembersService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { Member, ModificationInfo, ServiceResponse } from '@app/types';

import * as MembersActions from './members.actions';
import * as MembersSelectors from './members.selectors';

@Injectable()
export class MembersEffects {
  fetchMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMembersRequested),
      tap(() => this.loaderService.display(true)),
      concatLatestFrom(() => this.store.select(AuthSelectors.isAdmin)),
      switchMap(([, isAdmin]) =>
        this.membersService.getMembers(isAdmin!).pipe(
          map((response: ServiceResponse<Member[]>) => {
            return response.error
              ? MembersActions.fetchMembersFailed({ error: response.error })
              : MembersActions.fetchMembersSucceeded({
                  allMembers: response.payload!,
                });
          }),
        ),
      ),
      tap(() => this.loaderService.display(false)),
    );
  });

  fetchMemberForEditScreen$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberForEditScreenRequested),
      tap(() => this.loaderService.display(true)),
      switchMap(({ memberId }) =>
        this.membersService.getMember(memberId).pipe(
          map((response: ServiceResponse<Member>) =>
            response.error
              ? MembersActions.fetchMemberForEditScreenFailed({
                  error: response.error,
                })
              : MembersActions.fetchMemberForEditScreenSucceeded({
                  member: response.payload!,
                }),
          ),
        ),
      ),
      tap(() => this.loaderService.display(false)),
    );
  });

  setMemberForEditing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberForEditScreenSucceeded),
      map(({ member }) => MembersActions.memberSetForEditing({ member })),
    );
  });

  deleteMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberConfirmed),
      tap(() => this.loaderService.display(true)),
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
      tap(() => this.loaderService.display(false)),
    );
  });

  addMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberConfirmed),
      tap(() => this.loaderService.display(true)),
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
      tap(() => this.loaderService.display(false)),
    );
  });

  updateMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberConfirmed),
      tap(() => this.loaderService.display(true)),
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
      tap(() => this.loaderService.display(false)),
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

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private loaderService: LoaderService,
    private membersService: MembersService,
  ) {}
}
