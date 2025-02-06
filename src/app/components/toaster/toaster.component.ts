import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import IconsModule from '@app/icons';
import { Toast } from '@app/models';

@Component({
  selector: 'lcc-toaster',
  template: `
    @for (toast of toasts; track toast) {
      <div
        class="toast"
        [ngClass]="'toast-' + toast.type">
        <i-feather
          [name]="getIcon(toast.type)"
          class="icon">
        </i-feather>
        <div class="text-container">
          <h4 class="lcc-truncate toast-title">{{ toast.title }}</h4>
          <p class="lcc-truncate-max-5-lines toast-message">{{ toast.message }}</p>
        </div>
      </div>
    }
  `,
  styleUrl: './toaster.component.scss',
  imports: [CommonModule, IconsModule],
})
export class ToasterComponent {
  @Input({ required: true }) public toasts!: Toast[];

  public getIcon(toastType: 'success' | 'info' | 'warning'): string {
    return toastType === 'success'
      ? 'check-circle'
      : toastType === 'warning'
        ? 'alert-triangle'
        : 'info';
  }
}
