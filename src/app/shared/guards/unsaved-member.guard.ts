import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { MemberEditorComponent, MemberEditorSelectors } from '@app/pages/members';
import {
  ModalActions,
  ModalButtonAction,
  ModalSelectors,
} from '@app/shared/components/modal';

@Injectable({
  providedIn: 'root',
})
export class UnsavedMemberGuard implements CanDeactivate<MemberEditorComponent> {
  constructor(private store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(MemberEditorSelectors.hasUnsavedChanges).pipe(
      switchMap((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) {
          return of(true);
        }

        this.store.dispatch(ModalActions.leaveWithUnsavedChangesRequested());
        return this.store.select(ModalSelectors.selection).pipe(
          filter((selection) => !!selection),
          map((selection) => selection === ModalButtonAction.LEAVE_OK)
        );
      })
    );
  }
}
