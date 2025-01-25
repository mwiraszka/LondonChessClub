import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  InjectionToken,
  Injector,
  Input,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';

import { AdminControlsConfig } from '@app/models';

import { AdminControlsComponent } from './admin-controls.component';

export const ADMIN_CONTROLS_CONFIG = new InjectionToken<AdminControlsConfig>(
  'Admin Controls Config',
);

@UntilDestroy()
@Directive({
  selector: '[adminControls]',
})
export class AdminControlsDirective implements OnDestroy {
  @Input() public adminControls: AdminControlsConfig | null = null;

  private adminControlsComponentRef: ComponentRef<AdminControlsComponent> | null = null;
  private overlayRef: OverlayRef | null = null;
  private documentClickListener?: () => void;
  private documentContextMenuListener?: () => void;
  private escapeKeyListener?: () => void;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly overlay: Overlay,
    private readonly renderer: Renderer2,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  ngOnDestroy(): void {
    this.detach();
    this.overlayRef?.dispose();
  }

  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();

    if (this.adminControls && !this.overlayRef?.hasAttached()) {
      this.attach();
    }
  }

  private attach(): void {
    if (this.overlayRef === null) {
      const positionStrategy = this.getPositionStrategy();
      const scrollStrategy = this.getScrollStrategy();
      this.overlayRef = this.overlay.create({ positionStrategy, scrollStrategy });
    }

    const injector = Injector.create({
      providers: [
        {
          provide: ADMIN_CONTROLS_CONFIG,
          useValue: this.adminControls,
        },
      ],
    });

    const componentPortal = new ComponentPortal(
      AdminControlsComponent,
      this.viewContainerRef,
      injector,
    );
    this.adminControlsComponentRef = this.overlayRef.attach(componentPortal);

    this.adminControlsComponentRef.instance.destroyed
      .pipe(untilDestroyed(this))
      .subscribe(() => this.detach());

    this.initDocumentEventListeners();

    // Unlike regular dialogs, this overlay is meant to go *under* the sticky app header,
    // so override the default z-index to a value lower than the header's z-index of 1000
    this.renderer.setStyle(
      document.querySelector('.cdk-overlay-container'),
      'z-index',
      '900',
    );
  }

  private detach(): void {
    this.overlayRef?.detach();
    this.documentClickListener?.();
    this.documentContextMenuListener?.();
    this.escapeKeyListener?.();

    this.renderer.removeStyle(
      document.querySelector('.cdk-overlay-container'),
      'z-index',
    );
  }

  private getPositionStrategy(): PositionStrategy {
    const position: ConnectedPosition = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      panelClass: 'bottom',
    };

    return this.overlay
      .position()
      .flexibleConnectedTo(this.element)
      .withPositions([position]);
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.overlay.scrollStrategies.close();
  }

  private initDocumentEventListeners(): void {
    this.documentClickListener = this.renderer.listen('document', 'click', () =>
      this.detach(),
    );

    this.escapeKeyListener = this.renderer.listen('document', 'keydown.escape', () =>
      this.detach(),
    );

    setTimeout(() => {
      this.documentContextMenuListener = this.renderer.listen(
        'document',
        'contextmenu',
        () => this.detach(),
      );
    });
  }
}
