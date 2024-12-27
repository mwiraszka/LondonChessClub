import { firstValueFrom, tap } from 'rxjs';

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Injectable,
  InjectionToken,
  Injector,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { DialogComponent } from '@app/components/dialog/dialog.component';
import type { DialogConfig, DialogOutput } from '@app/types';

export const DIALOG_CONFIG_TOKEN = new InjectionToken('Dialog Config');

@Injectable({ providedIn: 'root' })
export class DialogService<TComponent extends DialogOutput<TResult>, TResult> {
  private dialogComponentRef: ComponentRef<DialogComponent<TComponent, TResult>> | null =
    null;
  private overlayRef: OverlayRef | null = null;
  private renderer!: Renderer2;

  private documentClickListener?: () => void;
  private keyDownListener?: () => void;
  private overlayElementClickListener?: () => void;

  constructor(
    private readonly rendererFactory: RendererFactory2,
    private readonly overlay: Overlay,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public open(dialogConfig: DialogConfig<TComponent>): Promise<TResult | 'close'> {
    if (this.overlayRef) {
      this.close();
    }

    const overlayConfig: OverlayConfig = {
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: dialogConfig.isModal
        ? this.overlay.scrollStrategies.block()
        : this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: dialogConfig.isModal ? 'lcc-modal-backdrop' : 'lcc-dialog-backdrop',
    };

    this.overlayRef = this.overlay.create(overlayConfig);

    setTimeout(() => this.initEventListeners(this.overlayRef?.overlayElement));

    const injector = Injector.create({
      providers: [{ provide: DIALOG_CONFIG_TOKEN, useValue: dialogConfig }],
    });

    const dialogComponentPortal = new ComponentPortal(
      DialogComponent<TComponent, TResult>,
      null,
      injector,
    );
    this.dialogComponentRef = this.overlayRef.attach(dialogComponentPortal);

    return firstValueFrom(
      this.dialogComponentRef.instance.result.pipe(tap(() => this.close())),
    );
  }

  public close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;

    // 'Unlisten' to all event listeners by calling their returned functions
    this.overlayElementClickListener?.();
    this.documentClickListener?.();
    this.keyDownListener?.();
  }

  private initEventListeners(overlayElement?: HTMLElement): void {
    this.overlayElementClickListener = this.renderer.listen(
      overlayElement,
      'click',
      (event: MouseEvent) => {
        event.stopPropagation();
      },
    );

    this.documentClickListener = this.renderer.listen(
      'document',
      'click',
      (event: MouseEvent) => {
        if (!overlayElement?.contains(event.target as Node)) {
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
          this.close();
        }
      },
    );
  }
}
