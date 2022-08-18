import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';
import { customSort } from '@app/shared/utils';
import { AuthSelectors } from '@app/core/auth';

import * as MemberListScreenActions from './member-list-screen.actions';
import * as MemberListScreenSelectors from './member-list-screen.selectors';
import { MembersService } from '../../members.service';

@Injectable()
export class MemberListScreenEffects {
  getMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.loadMembersStarted),
      concatLatestFrom(() => this.store.select(AuthSelectors.isAdmin)),
      switchMap(([, isAdmin]) =>
        this.membersService.getMembers(isAdmin).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberListScreenActions.loadMembersFailed({ error: response.error })
              : MemberListScreenActions.loadMembersSucceeded({
                  allMembers: response.payload.members,
                })
          )
        )
      )
    )
  );

  deleteMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.deleteMemberConfirmed),
      concatLatestFrom(() => this.store.select(MemberListScreenSelectors.selectedMember)),
      switchMap(([, memberToDelete]) =>
        this.membersService.deleteMember(memberToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberListScreenActions.deleteMemberFailed({ error: response.error })
              : MemberListScreenActions.deleteMemberSucceeded({
                  deletedMember: response.payload.member,
                })
          )
        )
      )
    )
  );

  initiallySortMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.loadMembersSucceeded),
      concatLatestFrom(() => this.store.select(MemberListScreenSelectors.sortedBy)),
      map(([, sortedBy]) =>
        MemberListScreenActions.tableHeaderSelected({ header: sortedBy })
      )
    )
  );

  sortMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.tableHeaderSelected),
      concatLatestFrom(() => [
        this.store.select(MemberListScreenSelectors.members),
        this.store.select(MemberListScreenSelectors.sortedBy),
        this.store.select(MemberListScreenSelectors.isDescending),
      ]),
      map(([{ header }, members, sortedBy, isDescending]) => {
        const key = header;
        isDescending = sortedBy === key ? !isDescending : isDescending;
        return MemberListScreenActions.membersSorted({
          sortedMembers: [...members].sort(customSort(key, isDescending)),
          sortedBy: header,
          isDescending,
        });
      })
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          MemberListScreenActions.loadMembersFailed,
          MemberListScreenActions.deleteMemberFailed
        ),
        tap(({ error }) => {
          console.error(`[Member List Screen Effects]' ${error.message}`);
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
