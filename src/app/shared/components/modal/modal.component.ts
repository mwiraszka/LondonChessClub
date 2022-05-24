import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as ModalActions from './store/modal.actions';
import * as ModalSelectors from './store/modal.selectors';
import { ModalButtonActionTypes } from './types/modal-button.model';
import { Modal } from './types/modal.model';
import { ModalState } from './types/modal.state';

@Component({
  selector: 'lcc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  isOpen$: Observable<boolean>;
  modal$: Observable<Modal>;

  constructor(private store: Store<ModalState>) {}

  ngOnInit(): void {
    this.isOpen$ = this.store.pipe(select(ModalSelectors.isOpen));
    this.modal$ = this.store.pipe(select(ModalSelectors.modal));
  }

  onSelect(action: ModalButtonActionTypes): void {
    this.store.dispatch(ModalActions.selectionMade({ action }));
  }
}
