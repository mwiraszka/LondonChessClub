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
      concatLatestFrom(() => this.store.select(AuthSelectors.isAdmin)),
      switchMap(([, isAdmin]) => {
        const scope: ApiScope = isAdmin ? 'admin' : 'public';
        return this.membersService.getMembers(scope).pipe(
          map(members => MembersActions.fetchMembersSucceeded({ members })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.fetchMembersFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  fetchMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.memberEditRequested),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => this.store.select(AuthSelectors.isAdmin)),
      switchMap(([{ memberId }, isAdmin]) => {
        const scope: ApiScope = isAdmin ? 'admin' : 'public';
        return this.membersService.getMember(scope, memberId).pipe(
          map(member => MembersActions.fetchMemberSucceeded({ member })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.fetchMemberFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  addMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(MembersSelectors.formMember).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
      ]),
      switchMap(([, memberToAdd, user]) => {
        const dateNow = moment().toISOString();
        const modificationInfo: ModificationInfo = {
          createdBy: `${user.firstName} ${user.lastName}`,
          dateCreated: dateNow,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: dateNow,
        };
        const modifiedMember = { ...memberToAdd, modificationInfo };

        return this.membersService.addMember(modifiedMember).pipe(
          map(member => MembersActions.addMemberSucceeded({ member })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.addMemberFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  updateMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(MembersSelectors.formMember).pipe(filter(isDefined)),
        this.store.select(AuthSelectors.user).pipe(filter(isDefined)),
      ]),
      switchMap(([, memberToUpdate, user]) => {
        const peakRating = getNewPeakRating(
          memberToUpdate.rating,
          memberToUpdate.peakRating,
        );
        const modificationInfo: ModificationInfo = {
          createdBy: memberToUpdate.modificationInfo!.createdBy,
          dateCreated: memberToUpdate.modificationInfo!.dateCreated,
          lastEditedBy: `${user.firstName} ${user.lastName}`,
          dateLastEdited: moment().toISOString(),
        };
        const modifiedMember = { ...memberToUpdate, peakRating, modificationInfo };

        return this.membersService.updateMember(modifiedMember).pipe(
          map(member => MembersActions.updateMemberSucceeded({ member })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.updateMemberFailed({ errorResponse }));
          }),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  deleteMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberConfirmed),
      tap(() => this.loaderService.setIsLoading(true)),
      concatLatestFrom(() =>
        this.store.select(MembersSelectors.setMember).pipe(filter(isDefined)),
      ),
      switchMap(([, memberToDelete]) =>
        this.membersService.deleteMember(memberToDelete).pipe(
          map(member => MembersActions.deleteMemberSucceeded({ member })),
          catchError((errorResponse: HttpErrorResponse) => {
            errorResponse = parseHttpErrorResponse(errorResponse);
            return of(MembersActions.deleteMemberFailed({ errorResponse }));
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
