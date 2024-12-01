import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from '@app/components/dropdown/dropdown.directive';
import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { NavPathTypes } from '@app/types';

import { NavFacade } from './nav.facade';

@Component({
  standalone: true,
  selector: 'lcc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [NavFacade],
  imports: [
    CommonModule,
    DropdownDirective,
    IconsModule,
    RouterLinkActive,
    RouterLink,
    ToggleSwitchComponent,
    TooltipDirective,
  ],
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
