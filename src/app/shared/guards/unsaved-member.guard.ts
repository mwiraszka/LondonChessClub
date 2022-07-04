import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import {
  MemberEditorScreenComponent,
  MemberEditorScreenSelectors,
} from '@app/screens/members';
import {
  ModalActions,
  ModalButtonActionTypes,
  ModalSelectors,
} from '@app/shared/components/modal';

@Injectable({ providedIn: 'root' })
export class UnsavedMemberGuard implements CanDeactivate<MemberEditorScreenComponent> {
  constructor(private store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(MemberEditorScreenSelectors.hasUnsavedChanges).pipe(
      switchMap((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) {
          return of(true);
        }

        this.store.dispatch(ModalActions.leaveWithUnsavedChangesRequested());
        return this.store.select(ModalSelectors.selection).pipe(
          filter((selection) => !!selection),
          map((selection) => selection === ModalButtonActionTypes.LEAVE_OK)
        );
      })
    );
  }
}
