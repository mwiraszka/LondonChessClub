import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as MemberEditorScreenActions from './member-editor-screen.actions';
import * as MemberEditorScreenSelectors from './member-editor-screen.selectors';
import * as MemberListScreenActions from '../../member-list/store/member-list-screen.actions';
import { MembersService } from '../../members.service';

@Injectable()
export class MemberEditorScreenEffects {
  resetMemberForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.createMemberSelected),
      map(() => MemberEditorScreenActions.resetMemberForm())
    )
  );

  getMemberToEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.editMemberSelected),
      map((memberToEdit) => MemberEditorScreenActions.memberToEditReceived(memberToEdit))
    )
  );

  addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorScreenActions.addMemberConfirmed),
      concatLatestFrom(() =>
        this.store.select(MemberEditorScreenSelectors.memberCurrently)
      ),
      switchMap(([, memberToAdd]) => {
        return this.membersService.addMember(memberToAdd).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberEditorScreenActions.addMemberFailed({ error: response.error })
              : MemberEditorScreenActions.addMemberSucceeded({
                  addedMember: response.payload.member,
                })
          )
        );
      })
    )
  );

  updateMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorScreenActions.updateMemberConfirmed),
      concatLatestFrom(() =>
        this.store.select(MemberEditorScreenSelectors.memberCurrently)
      ),
      switchMap(([, memberToUpdate]) => {
        return this.membersService.updateMember(memberToUpdate).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberEditorScreenActions.updateMemberFailed({ error: response.error })
              : MemberEditorScreenActions.updateMemberSucceeded({
                  updatedMember: response.payload.member,
                })
          )
        );
      })
    )
  );

  logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          MemberEditorScreenActions.addMemberFailed,
          MemberEditorScreenActions.updateMemberFailed
        ),
        tap(({ error }) => {
          console.error(`[Member Editor Screen Effects]' ${error.message}`);
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
