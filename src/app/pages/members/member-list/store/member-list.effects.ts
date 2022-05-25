import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as MemberListActions from './member-list.actions';
import * as MemberListSelectors from './member-list.selectors';
import { MembersService } from '../../members.service';

@Injectable()
export class MemberListEffects {
  getMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.loadMembersStarted),
      switchMap(() =>
        this.membersService.getMembers().pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberListActions.loadMembersFailed({ error: response.error })
              : MemberListActions.loadMembersSucceeded({
                  allMembers: response.payload.members,
                })
          )
        )
      )
    )
  );

  deleteMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.deleteMemberConfirmed),
      concatLatestFrom(() => this.store.select(MemberListSelectors.selectedMember)),
      switchMap(([, memberToDelete]) =>
        this.membersService.deleteMember(memberToDelete).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberListActions.deleteMemberFailed({ error: response.error })
              : MemberListActions.deleteMemberSucceeded({
                  deletedMember: response.payload.member,
                })
          )
        )
      )
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MemberListActions.loadMembersFailed, MemberListActions.deleteMemberFailed),
        tap(({ error }) => {
          console.error(`[Member List Effects]' ${error.message}`);
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
