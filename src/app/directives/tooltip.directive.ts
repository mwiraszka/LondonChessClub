import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  PositionStrategy,
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

import { TooltipComponent } from '@app/components/tooltip/tooltip.component';
import { Pixels } from '@app/models';
import { isDefined } from '@app/utils';

export const TOOLTIP_CONTENT_TOKEN = new InjectionToken<string | TemplateRef<unknown>>(
  'Tooltip Content',
);

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() tooltip: string | TemplateRef<unknown> | null = null;

  private overlayRef: OverlayRef | null = null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly overlay: Overlay,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  @HostListener('mouseenter', ['$event'])
  @HostListener('focus', ['$event'])
  public attach(event?: MouseEvent | FocusEvent): void {
    if (isDefined(this.tooltip) && !this.overlayRef?.hasAttached()) {
      const clientY: Pixels | undefined =
        event instanceof MouseEvent ? event.clientY : undefined;

      if (this.overlayRef === null) {
        this.overlayRef = this.overlay.create({
          positionStrategy: this.getPositionStrategy(clientY),
          scrollStrategy: this.overlay.scrollStrategies.close(),
        });
      }

      const injector = Injector.create({
        providers: [
          {
            provide: TOOLTIP_CONTENT_TOKEN,
            useValue: this.tooltip,
          },
        ],
      });

      const componentPortal = new ComponentPortal(
        TooltipComponent,
        this.viewContainerRef,
        injector,
      );

      this.overlayRef.attach(componentPortal);
    }
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  public detach(): void {
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
      .flexibleConnectedTo(this.elementRef)
      .withPositions(preferredPositions);
  }
}
