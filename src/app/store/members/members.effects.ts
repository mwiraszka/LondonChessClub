import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import type { Member } from '@app/models';
import { LoaderService, MembersService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { getNewPeakRating, isDefined } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import { MembersActions, MembersSelectors } from '.';

@Injectable()
export class MembersEffects {
  fetchMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMembersRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(AuthSelectors.selectIsAdmin),
        this.store.select(MembersSelectors.selectOptions),
      ]),
      switchMap(([, isAdmin, options]) =>
        this.membersService.getMembers(isAdmin, options).pipe(
          map(response =>
            MembersActions.fetchMembersSucceeded({
              members: response.data.items,
              filteredCount: response.data.filteredCount,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(MembersActions.fetchMembersFailed({ error: parseError(error) })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  refetchMembersAfterPaginationOptionsChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.paginationOptionsChanged),
      filter(({ fetch }) => fetch),
      map(() => MembersActions.fetchMembersRequested()),
    );
  });

  fetchMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ memberId }) => {
        return this.membersService.getMember(memberId).pipe(
          map(response => MembersActions.fetchMemberSucceeded({ member: response.data })),
          catchError(error =>
            of(MembersActions.fetchMemberFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(MembersSelectors.selectMemberFormDataById(null)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, formData, user]) => {
        const member: Member = {
          ...formData,
          id: '',
          peakRating: formData.rating,
          modificationInfo: {
            createdBy: `${user.firstName} ${user.lastName}`,
            dateCreated: moment().toISOString(),
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.membersService.addMember(member).pipe(
          map(response =>
            MembersActions.addMemberSucceeded({
              member: { ...member, id: response.data },
            }),
          ),
          catchError(error =>
            of(MembersActions.addMemberFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(({ memberId }) => [
        this.store
          .select(MembersSelectors.selectMemberById(memberId))
          .pipe(filter(isDefined)),
        this.store.select(MembersSelectors.selectMemberFormDataById(memberId)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, member, formData, user]) => {
        const updatedMember: Member = {
          ...member,
          ...formData,
          peakRating: getNewPeakRating(formData.rating, formData.peakRating),
          modificationInfo: {
            ...member.modificationInfo,
            lastEditedBy: `${user.firstName} ${user.lastName}`,
            dateLastEdited: moment().toISOString(),
          },
        };

        return this.membersService.updateMember(updatedMember).pipe(
          map(() =>
            MembersActions.updateMemberSucceeded({
              member: updatedMember,
              originalMemberName: `${member.firstName} ${member.lastName}`,
            }),
          ),
          catchError(error =>
            of(MembersActions.updateMemberFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      switchMap(({ member }) =>
        this.membersService.deleteMember(member.id).pipe(
          filter(response => response.data === member.id),
          map(() =>
            MembersActions.deleteMemberSucceeded({
              memberId: member.id,
              memberName: `${member.firstName} ${member.lastName}`,
            }),
          ),
          catchError(error =>
            of(MembersActions.deleteMemberFailed({ error: parseError(error) })),
          ),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly loaderService: LoaderService,
    private readonly membersService: MembersService,
    private readonly store: Store,
  ) {}
}
