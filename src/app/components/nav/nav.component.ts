import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from '@app/components/dropdown/dropdown.directive';
import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import { RouterLinkPipe } from '@app/pipes';
import { AppActions } from '@app/store/app';
import { NavSelectors } from '@app/store/nav';
import type { InternalLink } from '@app/types';

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
    RouterLinkPipe,
    ToggleSwitchComponent,
    TooltipDirective,
  ],
})
export class NavComponent {
  public readonly links: InternalLink[] = [
    {
      text: 'Home',
      internalPath: '',
      icon: 'home',
    },
    {
      text: 'About',
      internalPath: 'about',
      icon: 'info',
    },
    {
      text: 'Members',
      internalPath: 'members',
      icon: 'users',
    },
    {
      text: 'Schedule',
      internalPath: 'schedule',
      icon: 'calendar',
    },
    {
      text: 'News',
      internalPath: 'news',
      icon: 'activity',
    },
    {
      text: 'City Champion',
      internalPath: 'city-champion',
      icon: 'award',
    },
    {
      text: 'Photo Gallery',
      internalPath: 'photo-gallery',
      icon: 'camera',
    },
    {
      text: 'Game Archives',
      internalPath: 'game-archives',
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
