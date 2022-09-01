import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ModalButtonActionTypes } from '@app/types';
import { ModalActions, ModalSelectors } from '@app/store/modal';

@Injectable()
export class ModalFacade {
  modal$ = this.store.select(ModalSelectors.modal);

  constructor(private store: Store) {}

  onSelect(action: ModalButtonActionTypes): void {
    this.store.dispatch(ModalActions.selectionMade({ action }));
  }
}
