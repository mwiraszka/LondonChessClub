import { firstValueFrom, tap } from 'rxjs';

import {
  Overlay,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Injectable,
  InjectionToken,
  Injector,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { DialogComponent } from '@app/components/dialog/dialog.component';
import type { DialogConfig, DialogOutput } from '@app/models';

export const DIALOG_CONFIG_TOKEN = new InjectionToken<DialogConfig<unknown>>(
  'Dialog Config',
);

@Injectable({ providedIn: 'root' })
export class DialogService {
  private documentClickListener?: () => void;
  private keyDownListener?: () => void;
  private renderer!: Renderer2;

  private _overlayRefs: OverlayRef[] = [];
  public get overlayRefs(): OverlayRef[] {
    return this._overlayRefs;
  }

  constructor(
    private readonly overlay: Overlay,
    private readonly rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public open<TComponent extends DialogOutput<TResult>, TResult>(
    dialogConfig: DialogConfig<TComponent>,
  ): Promise<TResult | 'close'> {
    const overlayContainerElement = document.querySelector('.cdk-overlay-container');
    if (overlayContainerElement) {
      // This style never gets removed, only overidden by other overlay directives/services
      this.renderer.setStyle(overlayContainerElement, 'z-index', '1100');
    }

    const injector = Injector.create({
      providers: [{ provide: DIALOG_CONFIG_TOKEN, useValue: dialogConfig }],
    });

    const dialogComponentPortal = new ComponentPortal(
      DialogComponent<TComponent, TResult>,
      null,
      injector,
    );

    const overlayRef = this.overlay.create({
      positionStrategy: this.getPositionStrategy(),
      scrollStrategy: this.getScrollStrategy(dialogConfig.isModal),
      hasBackdrop: dialogConfig.isModal,
      backdropClass: 'lcc-modal-backdrop',
    });

    const dialogComponentRef = overlayRef.attach(dialogComponentPortal);

    // Only init listeners once, when first overlay is created, and with timeout to prevent
    // the click event that opened up this dialog from being used
    if (this._overlayRefs.length === 0) {
      setTimeout(() => this.initEventListeners());
    }

    this._overlayRefs?.push(overlayRef);

    return firstValueFrom(
      dialogComponentRef.instance.result.pipe(tap(() => this.close())),
    );
  }

  private close(): void {
    const overlayRef = this._overlayRefs.pop();

    if (overlayRef) {
      overlayRef.dispose();
    }

    // Only remove listeners when there are no more overlays
    if (this._overlayRefs.length === 0) {
      this.documentClickListener?.();
      this.keyDownListener?.();
    }
  }

  private initEventListeners(): void {
    this.documentClickListener = this.renderer.listen(
      'document',
      'click',
      (event: PointerEvent) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.classList.contains('cdk-overlay-backdrop')
        ) {
          event.stopImmediatePropagation();
          this.close();
        }
      },
    );

    this.keyDownListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', ' '].includes(
            event.key,
          )
        ) {
          event.preventDefault();
        } else if (event.key === 'Escape') {
          event.stopImmediatePropagation();
          this.close();
        }
      },
    );
  }

  private getPositionStrategy(): PositionStrategy {
    return this.overlay.position().global().centerHorizontally().centerVertically();
  }

  private getScrollStrategy(isModal?: boolean): ScrollStrategy {
    return isModal
      ? this.overlay.scrollStrategies.noop()
      : this.overlay.scrollStrategies.block();
  }
}
