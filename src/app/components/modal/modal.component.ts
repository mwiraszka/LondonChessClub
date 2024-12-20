import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IconsModule } from '@app/icons';
import { ModalActions, ModalSelectors } from '@app/store/modal';
import { ModalButtonActionTypes } from '@app/types';

@Component({
  selector: 'lcc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, IconsModule],
})
export class ModalComponent {
  public readonly modal$ = this.store.select(ModalSelectors.selectModal);

  constructor(private readonly store: Store) {}

  public onSelect(action: ModalButtonActionTypes): void {
    this.store.dispatch(ModalActions.selectionMade({ action }));
  }

  public onClose(): void {
    this.store.dispatch(
      ModalActions.selectionMade({
        action: ModalButtonActionTypes.LEAVE_CANCEL,
      }),
    );
  }
}
