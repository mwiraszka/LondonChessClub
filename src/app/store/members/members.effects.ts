import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import type { ApiScope, ModificationInfo } from '@app/models';
import { LoaderService, MembersService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { getNewPeakRating, isDefined } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import * as MembersActions from './members.actions';
import * as MembersSelectors from './members.selectors';

@Injectable()
export class MembersEffects {
  fetchMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMembersRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      switchMap(([, isAdmin]) => {
        const scope: ApiScope = isAdmin ? 'admin' : 'public';
        return this.membersService.getMembers(scope).pipe(
          map(response =>
            MembersActions.fetchMembersSucceeded({ members: response.data }),
          ),
          catchError(error =>
            of(MembersActions.fetchMembersFailed({ error: parseError(error) })),
          ),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
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
        this.store.select(MembersSelectors.selectMemberFormData).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, memberFormData, user]) => {
        const modificationInfo: ModificationInfo = {
          createdBy: `${user.firstName} ${user.lastName}`,
          dateCreated: moment().toISOString(),
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedMember = {
          ...memberFormData,
          modificationInfo,
          id: null,
          peakRating: memberFormData.rating,
        };

        return this.membersService.addMember(modifiedMember).pipe(
          map(response =>
            MembersActions.addMemberSucceeded({
              member: { ...modifiedMember, id: response.data },
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
      concatLatestFrom(() => [
        this.store.select(MembersSelectors.selectMember).pipe(filter(isDefined)),
        this.store.select(MembersSelectors.selectMemberFormData).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ]),
      switchMap(([, member, memberFormData, user]) => {
        const originalMemberName = `${member.firstName} ${member.lastName}`;
        const peakRating = getNewPeakRating(
          memberFormData.rating,
          memberFormData.peakRating,
        );
        const modificationInfo: ModificationInfo = {
          ...member.modificationInfo,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedMember = {
          ...member,
          ...memberFormData,
          peakRating,
          modificationInfo,
        };

        return this.membersService.updateMember(modifiedMember).pipe(
          map(() =>
            MembersActions.updateMemberSucceeded({
              member,
              originalMemberName,
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
        this.membersService.deleteMember(member).pipe(
          map(() =>
            MembersActions.deleteMemberSucceeded({
              member,
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
