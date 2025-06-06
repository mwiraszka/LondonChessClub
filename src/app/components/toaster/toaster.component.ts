import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import IconsModule from '@app/icons';
import { Toast } from '@app/models';
import { ToastService } from '@app/services';

@Component({
  selector: 'lcc-toaster',
  template: `
    @for (toast of toasts; track toast) {
      <div
        class="toast"
        [ngClass]="'toast-' + toast.type"
        [style]="{
          '--animation-duration': ToastService.TOAST_DURATION + 'ms',
        }"
        (click)="onToastClick(toast)">
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
  readonly ToastService = ToastService;

  @Input({ required: true }) public toasts!: Toast[];

  constructor(private readonly toastService: ToastService) {}

  public getIcon(toastType: 'success' | 'info' | 'warning'): string {
    return toastType === 'success'
      ? 'check-circle'
      : toastType === 'warning'
        ? 'alert-triangle'
        : 'info';
  }

  public onToastClick(toast: Toast): void {
    this.toastService.removeToast(toast);
  }
}
