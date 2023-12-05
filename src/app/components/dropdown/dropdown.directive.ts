import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostBinding, HostListener, Inject } from '@angular/core';

@Directive({
  selector: '[dropdown]',
})
export class DropdownDirective {
  dropdownElement = this.elementRef.nativeElement;

  @HostBinding('class.lcc-dropdown-open')
  isOpen = false;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private elementRef: ElementRef,
  ) {}

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedOnTab = this._document
      .querySelector('.lcc-dropdown-tab')
      ?.contains(targetElement);

    if (clickedOnTab && !this.isOpen) {
      this.isOpen = true;
      return;
    }

    const clickedOutside = !this.dropdownElement.contains(targetElement);
    if (clickedOutside && this.isOpen) {
      this.isOpen = false;
    }
  }
}
