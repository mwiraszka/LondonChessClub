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

import { getTextWidth, isTouchScreen } from '@app/utils';

import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnChanges, OnDestroy {
  private readonly TOOLTIP_MAX_WIDTH_PX = 120;
  private readonly SIDE_SCREEN_PADDING_PX = 1;

  // Must match the sum of the left and right
  // padding values set in the tooltip component
  private readonly TOOLTIP_SIDE_PADDING_PX = 16;

  @Input() tooltip: string | null = null;

  private componentRef: ComponentRef<TooltipComponent> | null = null;
  private screenWidth = window.innerWidth;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
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

  // Manually re-draw tooltip if text already existed and it changed
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltip'].previousValue) {
      this.destroy();
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  init(): void {
    if (!this.componentRef && !isTouchScreen()) {
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
        this.TOOLTIP_MAX_WIDTH_PX - this.TOOLTIP_SIDE_PADDING_PX
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

      this.componentRef.instance.tooltip = this.tooltip;
      this.componentRef.instance.width = tooltipTextWidth + this.TOOLTIP_SIDE_PADDING_PX;
      this.componentRef.instance.left = elementCenter + rightOffset - leftOffset;
      this.componentRef.instance.top = bottom;
    }
  }
}
