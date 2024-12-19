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

  onClose(): void {
    this.store.dispatch(
      ModalActions.selectionMade({
        action: ModalButtonActionTypes.LEAVE_CANCEL,
      }),
    );
  }
}
