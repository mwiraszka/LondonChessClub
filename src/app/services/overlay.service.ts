import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
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

    this.overlayRef = this.overlay.create({
      positionStrategy: new GlobalPositionStrategy()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
      height: '90vh',
      width: '90vw',
    });

    this.overlayRef.overlayElement.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
    });
    setTimeout(() => this._document.addEventListener('click', this.onDocumentClick));
    this.renderer.setStyle(this._document.body, 'overflow', 'hidden');

    const componentPortal = new ComponentPortal<T>(component);

    return this.overlayRef.attach(componentPortal);
  }

  public close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this._document.removeEventListener('click', this.onDocumentClick);
    this.renderer.removeStyle(this._document.body, 'overflow');
  }

  private onDocumentClick = (event: MouseEvent): void => {
    if (!this.overlayRef?.overlayElement?.contains(event.target as Node)) {
      this.close();
    }
  };
}
