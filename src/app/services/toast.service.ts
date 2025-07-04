import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';

import { ToasterComponent } from '@app/components/toaster/toaster.component';
import { Toast } from '@app/models';

// Type alias for timeout IDs returned by setTimeout
type TimeoutId = ReturnType<typeof setTimeout>;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public static readonly TOAST_DURATION = 5000;

  private overlayRef: OverlayRef | null = null;
  private toasterComponentRef: ComponentRef<ToasterComponent> | null = null;
  private activeToasts: Toast[] = [];
  private toastTimers: Map<Toast, TimeoutId> = new Map();

  constructor(private overlay: Overlay) {}

  public displayToast(toast: Toast): void {
    this.activeToasts = [...this.activeToasts, toast].slice(-5);

    this.createOrUpdateOverlay();

    const timerId = this.createTimeout(() => {
      this.removeToast(toast);
    }, ToastService.TOAST_DURATION);

    this.toastTimers.set(toast, timerId);
  }

  public removeToast(toast: Toast): void {
    this.activeToasts = this.activeToasts.filter(t => t !== toast);

    if (this.toastTimers.has(toast)) {
      this.clearTimeout(this.toastTimers.get(toast)!);
      this.toastTimers.delete(toast);
    }

    if (this.activeToasts.length === 0) {
      this.destroyOverlay();
    } else {
      this.updateToasterComponent();
    }
  }

  private createOrUpdateOverlay(): void {
    if (!this.overlayRef) {
      const positionStrategy = this.overlay.position().global().bottom('20px');

      if (window.matchMedia('(max-width: 1000px)').matches) {
        positionStrategy.centerHorizontally();
      } else {
        positionStrategy.right('20px');
      }

      const config = new OverlayConfig({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        hasBackdrop: false,
        panelClass: ['toast-overlay'],
      });

      this.overlayRef = this.overlay.create(config);

      const portal = new ComponentPortal(ToasterComponent);
      this.toasterComponentRef = this.overlayRef.attach(portal);
    }

    this.updateToasterComponent();
  }

  private updateToasterComponent(): void {
    if (this.toasterComponentRef && this.toasterComponentRef.instance) {
      this.toasterComponentRef.instance.toasts = this.activeToasts;
    }
  }

  private destroyOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.toasterComponentRef = null;
    }

    this.toastTimers.forEach(timerId => this.clearTimeout(timerId));
    this.toastTimers.clear();
  }

  private createTimeout(callback: () => void, duration: number): TimeoutId {
    return setTimeout(callback, duration);
  }

  private clearTimeout(timeoutId: TimeoutId): void {
    clearTimeout(timeoutId);
  }
}
