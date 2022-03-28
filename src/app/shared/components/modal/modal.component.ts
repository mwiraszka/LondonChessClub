import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as ModalActions from './store/modal.actions';
import * as ModalSelectors from './store/modal.selectors';
import { ModalButtonAction } from './types/modal-button-action.model';
import { ModalState } from './types/modal.state';
import { ModalContent } from './types/modal-content.model';

@Component({
  selector: 'lcc-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  isOpen$: Observable<boolean>;
  content$: Observable<ModalContent>;

  constructor(private store: Store<ModalState>) {}

  ngOnInit(): void {
    this.isOpen$ = this.store.pipe(select(ModalSelectors.isOpen));
    this.content$ = this.store.pipe(select(ModalSelectors.content));
  }

  onSelect(action: ModalButtonAction): void {
    this.store.dispatch(ModalActions.selectionMade({ action }));
  }
}
