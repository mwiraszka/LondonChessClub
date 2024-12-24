import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconsModule } from '@app/icons';
import type { BasicDialogResult, Dialog, DialogOutput } from '@app/types';

@Component({
  selector: 'lcc-basic-dialog',
  template: `
    <h3>{{ dialog.title }}</h3>
    <p>{{ dialog.body }}</p>
    <div class="buttons-container">
      <button
        class="lcc-secondary-button lcc-dark-button"
        (click)="dialogResult.emit('cancel')">
        {{ dialog.cancelButtonText ?? 'Cancel' }}
      </button>
      <button
        [ngClass]="
          dialog.confirmButtonType === 'warning'
            ? 'lcc-warning-button'
            : 'lcc-primary-button'
        "
        (click)="dialogResult.emit('confirm')">
        {{ dialog.confirmButtonText }}
      </button>
    </div>
  `,
  styleUrl: './basic-dialog.component.scss',
  imports: [CommonModule, IconsModule],
})
export class BasicDialogComponent implements DialogOutput<BasicDialogResult> {
  @Input({ required: true }) dialog!: Dialog;

  @Output() dialogResult = new EventEmitter<BasicDialogResult | 'close'>();
}
