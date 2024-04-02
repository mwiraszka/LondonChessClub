import { Component, HostListener } from '@angular/core';

import { NavPathTypes } from '@app/types';

import { NavFacade } from './nav.facade';

@Component({
  selector: 'lcc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [NavFacade],
})
export class NavComponent {
  readonly ICON_TEXT_BREAKPOINT = 699; // Match lt-md breakpoint value
  readonly NavPathTypes = NavPathTypes;

  isDropdownOpen = false;
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  constructor(public facade: NavFacade) {}
}
