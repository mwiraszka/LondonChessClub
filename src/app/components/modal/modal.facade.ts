import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ModalActions, ModalSelectors } from '@app/store/modal';
import { ModalButtonActionTypes } from '@app/types';

@Injectable()
export class ModalFacade {
  readonly modal$ = this.store.select(ModalSelectors.modal);

  constructor(private readonly store: Store) {}

  onSelect(action: ModalButtonActionTypes): void {
    this.store.dispatch(ModalActions.selectionMade({ action }));
  }

  // TODO: Hook up for all other 'cancel' action types/
  // implement a single, generic cancel type
  onClose(): void {
    this.store.dispatch(
      ModalActions.selectionMade({
        action: ModalButtonActionTypes.LEAVE_CANCEL,
      }),
    );
  }
}
