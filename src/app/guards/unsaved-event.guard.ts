import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { EventsSelectors } from '@app/store/events';
import { ModalActions, ModalSelectors } from '@app/store/modal';
import { ModalButtonActionTypes } from '@app/types';
import { isDefined } from '@app/utils';

@Injectable({ providedIn: 'root' })
export class UnsavedEventGuard {
  constructor(private readonly store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(EventsSelectors.selectHasUnsavedChanges).pipe(
      switchMap(hasUnsavedChanges => {
        if (!hasUnsavedChanges) {
          return of(true);
        }

        this.store.dispatch(ModalActions.leaveWithUnsavedChangesRequested());
        return this.store.select(ModalSelectors.selectSelection).pipe(
          filter(isDefined),
          map(selection => selection === ModalButtonActionTypes.LEAVE_OK),
        );
      }),
    );
  }
}
