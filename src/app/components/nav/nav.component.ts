import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from '@app/components/dropdown/dropdown.directive';
import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { Link, NavPathTypes } from '@app/types';

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
    RouterLink,
    RouterLinkActive,
    ToggleSwitchComponent,
    TooltipDirective,
  ],
})
export class NavComponent {
  readonly NavPathTypes = NavPathTypes;

  readonly links: Link[] = [
    {
      path: NavPathTypes.HOME,
      text: 'Home',
      icon: 'home',
    },
    {
      path: NavPathTypes.ABOUT,
      text: 'About',
      icon: 'info',
    },
    {
      path: NavPathTypes.MEMBERS,
      text: 'Members',
      icon: 'users',
    },
    {
      path: NavPathTypes.SCHEDULE,
      text: 'Schedule',
      icon: 'calendar',
    },
    {
      path: NavPathTypes.NEWS,
      text: 'News',
      icon: 'activity',
    },
    {
      path: NavPathTypes.CITY_CHAMPION,
      text: 'City Champion',
      icon: 'award',
    },
    {
      path: NavPathTypes.PHOTO_GALLERY,
      text: 'Photo Gallery',
      icon: 'camera',
    },
    {
      path: NavPathTypes.GAME_ARCHIVES,
      text: 'Game Archives',
      icon: 'grid',
    },
  ];

  isDropdownOpen = false;
  screenWidth = window.innerWidth;

  constructor(public facade: NavFacade) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }
}
