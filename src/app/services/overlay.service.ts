import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ComponentRef,
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  Type,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayService<T> {
  private overlayRef: OverlayRef | null = null;
  private renderer!: Renderer2;
  private documentClickListener?: () => void;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private overlay: Overlay,
    private rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public open(component: Type<T>): ComponentRef<T> {
    if (this.overlayRef) {
      this.close();
    }

    const overlayConfig: OverlayConfig = {
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
      height: '90vh',
      width: '90vw',
    };

    this.overlayRef = this.overlay.create(overlayConfig);

    this.renderer.setStyle(this._document.body, 'overflow', 'hidden');
    this.renderer.listen(this.overlayRef.overlayElement, 'click', (event: MouseEvent) => {
      event.stopPropagation();
    });

    setTimeout(() => {
      this.documentClickListener = this.renderer.listen(
        'document',
        'click',
        (event: MouseEvent) => {
          if (!this.overlayRef?.overlayElement?.contains(event.target as Node)) {
            this.close();
          }
        },
      );
    });

    const componentPortal = new ComponentPortal<T>(component);

    return this.overlayRef.attach(componentPortal);
  }

  public close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.renderer.removeStyle(this._document.body, 'overflow');

    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }
}
