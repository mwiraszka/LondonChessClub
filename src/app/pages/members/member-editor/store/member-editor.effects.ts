import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';

import { ServiceResponse } from '@app/shared/types';

import * as MemberEditorActions from './member-editor.actions';
import * as MemberEditorSelectors from './member-editor.selectors';
import * as MemberListActions from '../../member-list/store/member-list.actions';
import { MembersService } from '../../members.service';

@Injectable()
export class MemberEditorEffects {
  resetMemberForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.createMemberSelected),
      map(() => MemberEditorActions.resetMemberForm())
    )
  );

  getMemberToEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.editMemberSelected),
      map((memberToEdit) => MemberEditorActions.memberToEditReceived(memberToEdit))
    )
  );

  addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.addMemberConfirmed),
      concatLatestFrom(() => this.store.select(MemberEditorSelectors.memberCurrently)),
      switchMap(([, memberToAdd]) => {
        return this.membersService.addMember(memberToAdd).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberEditorActions.addMemberFailed({ error: response.error })
              : MemberEditorActions.addMemberSucceeded({
                  addedMember: response.payload.member,
                })
          )
        );
      })
    )
  );

  updateMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.updateMemberConfirmed),
      concatLatestFrom(() => this.store.select(MemberEditorSelectors.memberCurrently)),
      switchMap(([, memberToUpdate]) => {
        return this.membersService.updateMember(memberToUpdate).pipe(
          map((response: ServiceResponse) =>
            response.error
              ? MemberEditorActions.updateMemberFailed({ error: response.error })
              : MemberEditorActions.updateMemberSucceeded({
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
          MemberEditorActions.addMemberFailed,
          MemberEditorActions.updateMemberFailed
        ),
        tap(({ error }) => {
          console.error(`[Member Editor Effects]' ${error.message}`);
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
