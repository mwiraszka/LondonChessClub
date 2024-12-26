import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

import { getTextWidth } from '@app/utils';

import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnChanges, OnDestroy {
  // TODO: Automatically destroy when scrolling detected; also build in manual change detection
  // so that components that use directive can use manual push change detection strategy

  private readonly TOOLTIP_MAX_WIDTH_PX = 120;
  private readonly SIDE_SCREEN_PADDING_PX = 1;

  // Must match the sum of the left and right padding values set in the tooltip component
  private readonly TOOLTIP_SIDE_PADDING_PX = 16;

  @Input() tooltip: string | null = null;

  private componentRef: ComponentRef<TooltipComponent> | null = null;
  private screenWidth = window.innerWidth;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.init();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltip'].previousValue) {
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  init(): void {
    this.destroy();
    if (!this.componentRef && !window.matchMedia('(pointer: coarse)').matches) {
      this.componentRef = this.viewContainerRef.createComponent(TooltipComponent);
      this.setTooltipPlacement();

      const host = this.elementRef.nativeElement;
      host.insertBefore(this.componentRef.location.nativeElement, host.firstChild);
    }
  }

  destroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private setTooltipPlacement(): void {
    if (this.componentRef) {
      const { left, right, bottom } =
        this.elementRef.nativeElement.getBoundingClientRect();
      const elementCenter = (right - left) / 2 + left;

      const tooltipTextWidth = getTextWidth(
        this.tooltip,
        this.TOOLTIP_MAX_WIDTH_PX - this.TOOLTIP_SIDE_PADDING_PX,
      );

      const rightOverflow =
        this.screenWidth -
        elementCenter -
        (tooltipTextWidth + this.TOOLTIP_SIDE_PADDING_PX) / 2 -
        this.SIDE_SCREEN_PADDING_PX;
      const rightOffset = rightOverflow > 0 ? 0 : rightOverflow;

      const leftOverflow =
        elementCenter -
        (tooltipTextWidth + this.TOOLTIP_SIDE_PADDING_PX) / 2 -
        this.SIDE_SCREEN_PADDING_PX;
      const leftOffset = leftOverflow > 0 ? 0 : leftOverflow;

      this.componentRef.instance.width = tooltipTextWidth + this.TOOLTIP_SIDE_PADDING_PX;
      this.componentRef.instance.left = elementCenter + rightOffset - leftOffset;
      this.componentRef.instance.top = bottom;

      // Only render text after a brief timeout to prevent issue where tooltip is initially
      // placed incorrectly, shifting content underneath it for a short period of time

      setTimeout(() => {
        if (this.componentRef?.instance) {
          this.componentRef.instance.tooltip = this.tooltip;
        }
      }, 50);
    }
  }
}
