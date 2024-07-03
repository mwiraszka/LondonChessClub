import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Output,
} from '@angular/core';

@Directive({
  selector: '[dropdown]',
})
export class DropdownDirective {
  dropdownElement = this.elementRef.nativeElement;

  @HostBinding('class.lcc-dropdown-open')
  isOpen = false;

  @Output() opened = new EventEmitter<boolean>();

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    // Since the dropdown tab wraps the dropdown items themselves, we need
    // query selectors on each to determine what exactly was clicked
    const clickedOnDropdownTab = this._document
      .querySelector('.lcc-dropdown-tab')
      ?.contains(targetElement);

    const clickedOnDropdownLink = Array.from(
      this._document.querySelectorAll('.lcc-dropdown .lcc-dropdown-link')
    ).some((element) => element?.contains(targetElement));

    const clickedOutside = !this.dropdownElement.contains(targetElement);

    if (clickedOnDropdownTab && !clickedOnDropdownLink && !this.isOpen) {
      this.isOpen = true;
      this.opened.emit(true);
      return;
    }

    if ((clickedOnDropdownLink || clickedOutside) && this.isOpen) {
      this.isOpen = false;
      this.opened.emit(false);
    }
  }
}
