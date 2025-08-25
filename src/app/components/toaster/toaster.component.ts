import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
        <mat-icon>{{ getIcon(toast.type) }}</mat-icon>
        <div class="text-container">
          <div class="title lcc-truncate">{{ toast.title }}</div>
          <p class="message lcc-truncate-max-5-lines message">{{ toast.message }}</p>
        </div>
      </div>
    }
  `,
  styleUrl: './toaster.component.scss',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent {
  readonly ToastService = ToastService;

  @Input({ required: true }) public toasts!: Toast[];

  constructor(private readonly toastService: ToastService) {}

  public getIcon(toastType: 'success' | 'info' | 'warning'): string {
    return toastType === 'success'
      ? 'check_circle'
      : toastType === 'warning'
        ? 'warning_amber'
        : 'info';
  }

  public onToastClick(toast: Toast): void {
    this.toastService.removeToast(toast);
  }
}
