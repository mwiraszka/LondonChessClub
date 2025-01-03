import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoaderService, MembersService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import type { ApiScope, ModificationInfo } from '@app/types';
import { getNewPeakRating, isDefined, parseHttpErrorResponse } from '@app/utils';

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
          map(members => MembersActions.fetchMembersSucceeded({ members })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.fetchMembersFailed({ error }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      switchMap(([{ memberId }, isAdmin]) => {
        const scope: ApiScope = isAdmin ? 'admin' : 'public';
        return this.membersService.getMember(scope, memberId).pipe(
          map(member => MembersActions.fetchMemberSucceeded({ member })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.fetchMemberFailed({ error }));
          }),
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
        const modifiedMember = { ...memberFormData, modificationInfo, id: null };

        return this.membersService.addMember(modifiedMember).pipe(
          map(member => MembersActions.addMemberSucceeded({ member })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.addMemberFailed({ error }));
          }),
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
          map(member =>
            MembersActions.updateMemberSucceeded({ member, originalMemberName }),
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.updateMemberFailed({ error }));
          }),
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
          map(member => MembersActions.deleteMemberSucceeded({ member })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.deleteMemberFailed({ error }));
          }),
        ),
      ),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private loaderService: LoaderService,
    private membersService: MembersService,
  ) {}
}
