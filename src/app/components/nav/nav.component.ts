import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from '@app/components/dropdown/dropdown.directive';
import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { AppActions } from '@app/store/app';
import { NavSelectors } from '@app/store/nav';
import { Link, NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
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
  public readonly NavPathTypes = NavPathTypes;

  public readonly links: Link[] = [
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
  public readonly navViewModel$ = this.store.select(NavSelectors.selectNavViewModel);

  public isDropdownOpen = false;
  public screenWidth = window.innerWidth;

  constructor(private readonly store: Store) {}

  @HostListener('window:resize', ['$event'])
  private onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  public onToggleTheme(): void {
    this.store.dispatch(AppActions.themeToggled());
  }

  public onToggleSafeMode(): void {
    this.store.dispatch(AppActions.safeModeToggled());
  }
}
