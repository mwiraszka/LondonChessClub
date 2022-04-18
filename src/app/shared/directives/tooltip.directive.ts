import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

/**
 * Courtesy of Colin Broberg
 * (https://javascript.plainenglish.io/creating-a-tooltip-directive-in-angular-abfc607d52f3)
 */
@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() tooltip = ''; // The tooltip text to be displayed
  @Input() delay? = 100;

  private myPopup;
  private timer;

  constructor(private el: ElementRef) {}

  ngOnDestroy(): void {
    if (this.myPopup) {
      this.myPopup.remove();
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.timer = setTimeout(() => {
      let x =
        this.el.nativeElement.getBoundingClientRect().left +
        this.el.nativeElement.offsetWidth / 2; // Get the middle of the element
      let y =
        this.el.nativeElement.getBoundingClientRect().top +
        this.el.nativeElement.offsetHeight +
        6; // Get the bottom of the element, plus a little extra
      this.createTooltipPopup(x, y);
    }, this.delay);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.timer) clearTimeout(this.timer);
    if (this.myPopup) {
      this.myPopup.remove();
    }
  }

  private createTooltipPopup(x: number, y: number) {
    let popup = document.createElement('div');
    popup.innerHTML = this.tooltip;
    popup.setAttribute('class', 'tooltip-container');
    popup.style.top = y.toString() + 'px';
    popup.style.left = x.toString() + 'px';
    document.body.appendChild(popup);
    this.myPopup = popup;

    // Remove tooltip after 7 seconds
    setTimeout(() => {
      if (this.myPopup) {
        this.myPopup.remove();
      }
    }, 7000);
  }
}
