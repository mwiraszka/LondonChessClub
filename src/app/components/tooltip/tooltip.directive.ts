import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  InjectionToken,
  Injector,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { Pixels } from '@app/models';
import { isDefined } from '@app/utils';

import { TooltipComponent } from './tooltip.component';

export const TOOLTIP_DATA_TOKEN = new InjectionToken<string | TemplateRef<unknown>>(
  'Tooltip Data',
);

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() tooltip: string | TemplateRef<unknown> | null = null;

  private overlayRef: OverlayRef | null = null;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly overlay: Overlay,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  @HostListener('mouseenter', ['$event'])
  @HostListener('focus', ['$event'])
  private attach(event: MouseEvent | FocusEvent): void {
    if (!isDefined(this.tooltip) || this.isTouchScreen()) {
      return;
    }

    if (this.overlayRef === null) {
      const clientY = event instanceof MouseEvent ? event.clientY : undefined;

      this.overlayRef = this.overlay.create({
        positionStrategy: this.getPositionStrategy(clientY),
        scrollStrategy: this.getScrollStrategy(),
      });
    }

    const injector = Injector.create({
      providers: [
        {
          provide: TOOLTIP_DATA_TOKEN,
          useValue: this.tooltip,
        },
      ],
    });

    const componentPortal = new ComponentPortal(
      TooltipComponent,
      this.viewContainerRef,
      injector,
    );

    if (!this.overlayRef?.hasAttached()) {
      this.overlayRef.attach(componentPortal);
    } else {
      this.detach();
    }
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  private detach(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef?.detach();
    }
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }

  private getPositionStrategy(clientY?: Pixels): PositionStrategy {
    const positionsBelow: ConnectedPosition[] = [
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        panelClass: 'bottom',
        offsetY: 4,
      },
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        panelClass: 'bottom',
        offsetY: 4,
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        panelClass: 'bottom',
        offsetY: 4,
      },
    ];

    const positionsAbove: ConnectedPosition[] = [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        panelClass: 'top',
        offsetY: -4,
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        panelClass: 'top',
        offsetY: -4,
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        panelClass: 'top',
        offsetY: -4,
      },
    ];

    // Due to word wrapping in the Tooltip Component itself, the height of the tooltip container is
    // not known at this stage, so assume there's enough space above if the client is at least
    // 200px down from the top of the screen
    const preferredPositions =
      clientY && clientY > 200
        ? [...positionsAbove, ...positionsBelow]
        : [...positionsBelow, ...positionsAbove];

    return this.overlay
      .position()
      .flexibleConnectedTo(this.element)
      .withPositions(preferredPositions);
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.overlay.scrollStrategies.close();
  }

  private isTouchScreen(): boolean {
    return window.matchMedia('(pointer: coarse)').matches;
  }
}
