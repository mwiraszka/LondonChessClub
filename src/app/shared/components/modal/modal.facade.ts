import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ModalActions from './store/modal.actions';
import * as ModalSelectors from './store/modal.selectors';
import { ModalButtonActionTypes } from './types/modal-button.model';

@Injectable()
export class ModalFacade {
  modal$ = this.store.select(ModalSelectors.modal);
  isOpen$ = this.store.select(ModalSelectors.isOpen);

  constructor(private store: Store) {}

  onSelect(action: ModalButtonActionTypes): void {
    this.store.dispatch(ModalActions.selectionMade({ action }));
  }
}
