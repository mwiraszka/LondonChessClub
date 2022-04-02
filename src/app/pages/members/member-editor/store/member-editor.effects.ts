import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

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
          map((addedMember) => {
            return MemberEditorActions.addMemberSucceeded({ addedMember });
          }),
          catchError(() => {
            return of(
              MemberEditorActions.addMemberFailed({
                errorMessage: '[Member Editor Effects] Unknown error',
              })
            );
          })
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
          map((updatedMember) => {
            return MemberEditorActions.updateMemberSucceeded({ updatedMember });
          }),
          catchError(() => {
            return of(
              MemberEditorActions.updateMemberFailed({
                errorMessage: '[Member Editor Effects] Unknown error',
              })
            );
          })
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
        tap(({ errorMessage }) => {
          console.error(errorMessage);
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
