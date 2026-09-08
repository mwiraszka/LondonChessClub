import {
  AlertTriangleIconComponent,
  CheckCircleIconComponent,
  InfoIconComponent,
} from '@eagami/ui';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Type } from '@angular/core';

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
        <span class="toast-icon">
          <ng-container *ngComponentOutlet="getIcon(toast.type)" />
        </span>
        <div class="text-container">
          <div class="title lcc-truncate">{{ toast.title }}</div>
          <p class="message lcc-truncate-max-5-lines message">{{ toast.message }}</p>
        </div>
      </div>
    }
  `,
  styleUrl: './toaster.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent {
  readonly ToastService = ToastService;

  @Input({ required: true }) public toasts!: Toast[];

  constructor(private readonly toastService: ToastService) {}

  public getIcon(toastType: 'success' | 'info' | 'warning'): Type<unknown> {
    return toastType === 'success'
      ? CheckCircleIconComponent
      : toastType === 'warning'
        ? AlertTriangleIconComponent
        : InfoIconComponent;
  }

  public onToastClick(toast: Toast): void {
    this.toastService.removeToast(toast);
  }
}
