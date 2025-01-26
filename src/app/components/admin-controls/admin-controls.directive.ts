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
import { DialogService } from '@app/services';

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
  private documentClickListener?: () => void;
  private documentContextMenuListener?: () => void;
  private escapeKeyListener?: () => void;
  private overlayRef: OverlayRef | null = null;

  constructor(
    private readonly dialogService: DialogService,
    private readonly element: ElementRef<HTMLElement>,
    private readonly overlay: Overlay,
    private readonly renderer: Renderer2,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  ngOnDestroy(): void {
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

    setTimeout(() => {
      this.initDocumentEventListeners();
    });

    // When triggered via a component that is not rendered in a dialog (i.e. no dialogs currently
    // open), reduce z-index of this overlay so that the admin controls hide behind the app header;
    // this style never gets removed, only overidden by other overlay directives/services
    if (this.dialogService.overlayRefs.length === 0) {
      this.renderer.setStyle(
        document.querySelector('.cdk-overlay-container'),
        'z-index',
        '900',
      );
    }
  }

  private detach(): void {
    this.overlayRef?.detach();
    this.documentClickListener?.();
    this.documentContextMenuListener?.();
    this.escapeKeyListener?.();
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
    this.documentClickListener = this.renderer.listen(
      'document',
      'click',
      (event: PointerEvent) => {
        event.stopPropagation();
        this.detach();
      },
    );

    this.escapeKeyListener = this.renderer.listen(
      'document',
      'keydown.escape',
      (event: KeyboardEvent) => {
        event.stopPropagation();
        this.detach();
      },
    );

    this.documentContextMenuListener = this.renderer.listen(
      'document',
      'contextmenu',
      (event: PointerEvent) => {
        event.preventDefault();
        this.detach();
      },
    );
  }
}
