import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Injectable,
  InjectionToken,
  Injector,
  Renderer2,
  RendererFactory2,
  Type,
} from '@angular/core';

import { OverlayHeaderComponent } from '@app/components/overlay-header/overlay-header.component';

export const OVERLAY_DATA_TOKEN = new InjectionToken<any>('overlay-data');

@Injectable({ providedIn: 'root' })
export class OverlayService<T> {
  private overlayRef: OverlayRef | null = null;
  private renderer!: Renderer2;

  private documentClickListener?: () => void;
  private escapeListener?: () => void;

  constructor(
    private overlay: Overlay,
    private rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public open(component: Type<T>, data?: any): ComponentRef<T> {
    if (this.overlayRef) {
      this.close();
    }

    const injector = Injector.create({
      providers: [{ provide: OVERLAY_DATA_TOKEN, useValue: data }],
    });

    // TODO: automatically add header to rendered component!

    const overlayConfig: OverlayConfig = {
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
    };

    this.overlayRef = this.overlay.create(overlayConfig);

    this.renderer.listen(this.overlayRef.overlayElement, 'click', (event: MouseEvent) => {
      event.stopPropagation();
    });
    setTimeout(() => this.initCloseEventListeners());

    const overlayHeaderPortal = new ComponentPortal(OverlayHeaderComponent);
    const componentPortal = new ComponentPortal<T>(component, null, injector);

    this.overlayRef.attach(overlayHeaderPortal);
    return this.overlayRef.attach(componentPortal);
  }

  public close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;

    // 'Unlisten' to all closing events by calling the listeners' functions
    this.documentClickListener?.();
    this.escapeListener?.();
  }

  private initCloseEventListeners(): void {
    this.documentClickListener = this.renderer.listen(
      'document',
      'click',
      (event: MouseEvent) => {
        if (!this.overlayRef?.overlayElement?.contains(event.target as Node)) {
          this.close();
        }
      },
    );
    this.escapeListener = this.renderer.listen(
      'document',
      'keyup',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.close();
        }
      },
    );
  }
}
