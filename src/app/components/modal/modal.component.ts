import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconsModule } from '@app/icons';
import type { DialogOutput, Modal, ModalResult } from '@app/types';

@Component({
  selector: 'lcc-modal',
  template: `
    <h3>{{ modal.title }}</h3>
    <p>{{ modal.body }}</p>
    <div class="buttons-container">
      <button
        class="lcc-secondary-button lcc-dark-button"
        (click)="dialogResult.emit('cancel')">
        {{ modal.cancelButtonText ?? 'Cancel' }}
      </button>
      <button
        [ngClass]="
          modal.confirmButtonType === 'warning'
            ? 'lcc-warning-button'
            : 'lcc-primary-button'
        "
        (click)="dialogResult.emit('confirm')">
        {{ modal.confirmButtonText }}
      </button>
    </div>
  `,
  styleUrl: './modal.component.scss',
  imports: [CommonModule, IconsModule],
})
export class ModalComponent implements DialogOutput<ModalResult> {
  @Input({ required: true }) modal!: Modal;

  @Output() dialogResult = new EventEmitter<ModalResult | 'close'>();
}
