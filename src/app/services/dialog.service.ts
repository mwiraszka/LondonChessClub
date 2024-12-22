import { first } from 'rxjs/operators';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
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

import { DialogComponent } from '@app/components/dialog/dialog.component';
import { DialogControls } from '@app/types';

export interface DialogData<T> {
  component: Type<T>;
  inputs?: { [key: string]: unknown };
}

export const DIALOG_DATA_TOKEN = new InjectionToken('Dialog Data');

@Injectable({ providedIn: 'root' })
export class DialogService<T extends DialogControls> {
  private dialogComponentRef: ComponentRef<DialogComponent<T>> | null = null;
  private overlayRef: OverlayRef | null = null;
  private renderer!: Renderer2;

  private documentClickListener?: () => void;
  private keyDownListener?: () => void;
  private overlayElementClickListener?: () => void;

  constructor(
    private readonly overlay: Overlay,
    private readonly rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public open(dialogData: DialogData<T>): ComponentRef<DialogComponent<T>> {
    if (this.overlayRef) {
      this.close();
    }

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
      maxWidth: 'max(90vw, 1500px)',
      maxHeight: '90vh',
      backdropClass: 'lcc-backdrop',
    });

    setTimeout(() => this.initEventListeners(this.overlayRef?.overlayElement));

    const dataInjector = Injector.create({
      providers: [{ provide: DIALOG_DATA_TOKEN, useValue: dialogData }],
    });

    const dialogComponentPortal: ComponentPortal<DialogComponent<T>> =
      new ComponentPortal(DialogComponent<T>, null, dataInjector);
    this.dialogComponentRef = this.overlayRef.attach(dialogComponentPortal);

    this.dialogComponentRef.instance.close.pipe(first()).subscribe(() => this.close());
    this.dialogComponentRef.instance.confirm.pipe(first()).subscribe(() => this.close());

    return this.dialogComponentRef;
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
        if (!this.overlayRef?.overlayElement?.contains(event.target as Node)) {
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
