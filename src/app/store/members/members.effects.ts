import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { merge, of, timer } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Member } from '@app/models';
import { MembersApiService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { exportDataToCsv, getNewPeakRating, isDefined, isExpired } from '@app/utils';
import { parseError } from '@app/utils/error/parse-error.util';

import { MembersActions, MembersSelectors } from '.';

@Injectable()
export class MembersEffects {
  fetchAllMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchAllMembersRequested),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      switchMap(([, isAdmin]) =>
        this.membersApiService.getAllMembers(isAdmin).pipe(
          map(response =>
            MembersActions.fetchAllMembersSucceeded({
              members: response.data.items,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(MembersActions.fetchAllMembersFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  fetchFilteredMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        MembersActions.fetchFilteredMembersRequested,
        MembersActions.fetchFilteredMembersInBackgroundRequested,
      ),
      concatLatestFrom(() => [
        this.store.select(AuthSelectors.selectIsAdmin),
        this.store.select(MembersSelectors.selectOptions),
      ]),
      switchMap(([, isAdmin, options]) =>
        this.membersApiService.getFilteredMembers(isAdmin, options).pipe(
          map(response =>
            MembersActions.fetchFilteredMembersSucceeded({
              members: response.data.items,
              filteredCount: response.data.filteredCount,
              totalCount: response.data.totalCount,
            }),
          ),
          catchError(error =>
            of(MembersActions.fetchFilteredMembersFailed({ error: parseError(error) })),
          ),
        ),
      ),
    );
  });

  refetchFilteredMembers$ = createEffect(() => {
    const refetchActions$ = this.actions$.pipe(
      ofType(
        MembersActions.addMemberSucceeded,
        MembersActions.updateMemberSucceeded,
        MembersActions.deleteMemberSucceeded,
        MembersActions.paginationOptionsChanged,
      ),
    );

    const periodicCheck$ = timer(3 * 1000, 10 * 60 * 1000).pipe(
      switchMap(() =>
        this.store.select(MembersSelectors.selectLastFilteredFetch).pipe(take(1)),
      ),
      filter(lastFetch => isExpired(lastFetch)),
    );

    return merge(refetchActions$, periodicCheck$).pipe(
      map(() => MembersActions.fetchFilteredMembersInBackgroundRequested()),
    );
  });

  fetchMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberRequested),
      switchMap(({ memberId }) => {
        return this.membersApiService.getMember(memberId).pipe(
          map(response => MembersActions.fetchMemberSucceeded({ member: response.data })),
          catchError(error =>
            of(MembersActions.fetchMemberFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  addMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberRequested),
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

        return this.membersApiService.addMember(member).pipe(
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
    );
  });

  updateMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberRequested),
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

        return this.membersApiService.updateMember(updatedMember).pipe(
          filter(response => response.data === updatedMember.id),
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
    );
  });

  deleteMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberRequested),
      switchMap(({ member }) =>
        this.membersApiService.deleteMember(member.id).pipe(
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
    );
  });

  exportMembersToCsv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.exportMembersToCsvRequested),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      switchMap(([, isAdmin]) => {
        return this.membersApiService.getAllMembers(isAdmin).pipe(
          map(response => {
            const filename = `members_export_${new Date().toISOString().split('T')[0]}.csv`;
            const exportResult = exportDataToCsv(response.data.items, filename);

            return typeof exportResult === 'number'
              ? MembersActions.exportMembersToCsvSucceeded({
                  exportedCount: exportResult,
                })
              : MembersActions.exportMembersToCsvFailed({ error: exportResult });
          }),
          catchError(error =>
            of(MembersActions.fetchAllMembersFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  updateMemberRatings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberRatingsRequested),
      concatLatestFrom(() =>
        this.store.select(AuthSelectors.selectUser).pipe(filter(isDefined)),
      ),
      switchMap(([{ membersWithNewRatings }, user]) => {
        const updatedMembers: Member[] = membersWithNewRatings.map(
          memberWithNewRatings => {
            const { newRating, newPeakRating, ...member } = memberWithNewRatings;

            return {
              ...member,
              rating: newRating,
              peakRating: newPeakRating,
              modificationInfo: {
                ...member.modificationInfo,
                lastEditedBy: `${user.firstName} ${user.lastName}`,
                dateLastEdited: moment().toISOString(),
              },
            };
          },
        );

        return this.membersApiService.updateMembers(updatedMembers).pipe(
          map(() =>
            MembersActions.updateMemberRatingsSucceeded({ members: updatedMembers }),
          ),
          catchError(error =>
            of(MembersActions.updateMemberRatingsFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly membersApiService: MembersApiService,
    private readonly store: Store,
  ) {}
}
